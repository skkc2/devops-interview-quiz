import os
import subprocess
import time
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright, expect


ROOT = Path(__file__).resolve().parents[1]
HOST = "127.0.0.1"
PORT = 4173
BASE_URL = f"http://{HOST}:{PORT}"


class OpsLabBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = subprocess.Popen(
            ["python3", "-m", "http.server", str(PORT), "--bind", HOST],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        for _ in range(50):
            try:
                import urllib.request
                urllib.request.urlopen(BASE_URL, timeout=0.25)
                break
            except Exception:
                time.sleep(0.1)
        else:
            raise RuntimeError("Static test server did not start")

        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.terminate()
        cls.server.wait(timeout=5)

    def setUp(self):
        self.context = self.browser.new_context(accept_downloads=True)
        self.page = self.context.new_page()
        self.page.goto(BASE_URL, wait_until="networkidle")
        expect(self.page.locator("#available-count")).to_contain_text("available in the curated learning library")

    def tearDown(self):
        self.context.close()

    def choose_mode(self, mode):
        self.page.locator(f'[data-mode="{mode}"]').click()
        expect(self.page.locator(f'[data-mode="{mode}"]')).to_have_attribute("aria-pressed", "true")

    def start(self):
        self.page.locator("#start-quiz").click()
        expect(self.page.locator("#quiz-screen")).to_be_visible()
        expect(self.page.locator("#question-title")).not_to_be_empty()

    def test_initial_load_and_mode_buttons_update_selection(self):
        expect(self.page.locator("#home-screen")).to_be_visible()
        for mode in ("learn", "practice", "exam", "interview"):
            self.choose_mode(mode)
            expect(self.page.locator(f'[data-mode="{mode}"]')).to_have_class(
                __import__("re").compile(r".*selected.*")
            )
        self.choose_mode("learn")
        expect(self.page.locator("#timer-control")).to_be_hidden()

    def test_learning_library_and_mode_pool_counts(self):
        self.choose_mode("learn")
        self.page.locator("#start-quiz").click()
        expect(self.page.locator("#learning-screen")).to_be_visible()
        expect(self.page.locator("#learning-title")).to_have_text("Concepts")
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(6)
        self.page.locator('#learning-module-nav [data-module="commands"]').click()
        expect(self.page.locator("#learning-title")).to_have_text("Commands")
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(6)
        expect(self.page.locator("#learning-content-detail")).to_contain_text("kubectl get pods -o wide")
        self.page.locator("#back-from-learning").click()
        self.choose_mode("practice")
        expect(self.page.locator("#available-count")).to_contain_text("30 questions")
        self.choose_mode("exam")
        expect(self.page.locator("#available-count")).to_contain_text("30 questions")
        self.choose_mode("interview")
        expect(self.page.locator("#available-count")).to_contain_text("1 questions")
        expect(self.page.locator("#type-select")).to_have_value("interview")

    def test_requested_question_count_is_not_silently_reduced(self):
        self.choose_mode("practice")
        self.page.locator("#count-select").select_option("5")
        expect(self.page.locator("#start-quiz")).to_be_enabled()
        self.page.locator("#level-select").select_option("hard")
        expect(self.page.locator("#count-select")).to_have_value("5")
        self.page.locator("#type-select").select_option("command")
        expect(self.page.locator("#available-count")).to_contain_text("3 questions")
        expect(self.page.locator("#count-select")).to_have_value("5")
        expect(self.page.locator("#start-quiz")).to_be_disabled()
        expect(self.page.locator("#setup-message")).to_contain_text("Choose a smaller count")
        self.page.locator("#count-select").select_option("all")
        expect(self.page.locator("#start-quiz")).to_be_enabled()

    def test_all_eight_learning_destinations_open_and_show_content_or_empty_state(self):
        expected = {
            "concepts": "Concepts",
            "commands": "Commands",
            "scenarios": "Scenarios",
            "debugging": "Debugging",
            "timed": "Timed drills",
            "review": "Review queue",
            "interviews": "Interview prompts",
            "followups": "Follow-ups",
        }
        for module, title in expected.items():
            self.page.locator(f'[data-module="{module}"]').first.click()
            expect(self.page.locator("#learning-screen")).to_be_visible()
            expect(self.page.locator("#learning-title")).to_have_text(title)
            expect(self.page.locator("#learning-content-count")).not_to_be_empty()
            expect(self.page.locator("#learning-content-detail")).not_to_be_empty()
            self.page.locator("#back-from-learning").click()

    def test_exam_hides_feedback_until_session_finishes(self):
        self.choose_mode("exam")
        expect(self.page.locator("#timed-toggle")).to_be_checked()
        self.page.locator("#count-select").select_option("5")
        self.start()
        expect(self.page.locator("#timer-wrap")).to_be_visible()
        self.page.locator('[data-option="0"]').click()
        self.page.locator("#check-answer").click()
        expect(self.page.locator("#question-feedback")).to_be_hidden()
        expect(self.page.locator("#check-answer")).to_be_hidden()
        expect(self.page.locator('[data-option="0"]')).to_be_disabled()
        self.page.locator(f'[data-jump="{self.page.locator("[data-jump]").count() - 1}"]').click()
        self.page.locator("#finish-quiz").click()
        expect(self.page.locator("#results-screen")).to_be_visible()
        expect(self.page.locator("#result-mode")).to_have_text("Exam simulation")
        self.page.locator("#review-filter").select_option("all")
        expect(self.page.locator("#review-list .review-card")).to_have_count(5)

    def test_filters_update_available_pool_and_disable_empty_types(self):
        self.choose_mode("practice")
        self.page.locator("#level-select").select_option("medium")
        self.page.locator("#type-select").select_option("scenario")
        expect(self.page.locator("#available-count")).to_contain_text("10 questions")
        expect(self.page.locator('#type-select option[value="interview"]')).to_be_disabled()
        self.choose_mode("exam")
        expect(self.page.locator("#type-select")).to_have_value("scenario")
        expect(self.page.locator("#available-count")).to_contain_text("10 questions")
        expect(self.page.locator("#start-quiz")).to_be_enabled()

    def test_multi_select_answer_requires_selection_and_shows_correct_choices(self):
        self.choose_mode("practice")
        self.page.locator("#type-select").select_option("multi-select")
        self.start()
        self.page.locator("#check-answer").click()
        expect(self.page.locator("#quiz-live-feedback")).to_contain_text("Select at least one option")
        self.page.locator('[data-option="0"]').click()
        self.page.locator('[data-option="1"]').click()
        self.page.locator("#check-answer").click()
        expect(self.page.locator("#question-feedback")).to_be_visible()
        expect(self.page.locator("#feedback-answer")).to_contain_text("Correct choices")

    def test_interview_requires_notes_or_rating_and_supports_self_review(self):
        self.choose_mode("interview")
        expect(self.page.locator("#timer-control")).to_be_hidden()
        self.start()
        expect(self.page.locator("#interview-answer-area")).to_be_visible()
        self.page.locator("#check-answer").click()
        expect(self.page.locator("#quiz-live-feedback")).to_contain_text("Add a few notes")
        self.page.locator("#interview-answer").fill("I would inspect events, logs, and recent changes.")
        self.page.locator("#check-answer").click()
        expect(self.page.locator("#interview-self-check")).to_be_visible()
        self.page.locator('[data-rating="3"]').click()
        self.page.locator("#finish-quiz").click()
        expect(self.page.locator("#results-screen")).to_be_visible()
        expect(self.page.locator("#result-score")).to_have_text("—")

    def test_navigation_saved_question_and_keyboard_shortcut(self):
        self.choose_mode("practice")
        self.page.locator("#count-select").select_option("5")
        self.start()
        expect(self.page.locator("#previous-question")).to_be_disabled()
        self.page.locator("#flag-question").click()
        expect(self.page.locator("#flag-question")).to_contain_text("Saved for review")
        self.page.keyboard.press("1")
        expect(self.page.locator('[data-option="0"]')).to_have_attribute("aria-pressed", "true")
        self.page.locator("#check-answer").click()
        expect(self.page.locator("#next-question")).to_be_visible()
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#question-counter")).to_contain_text("Question 2")
        self.page.locator("#previous-question").click()
        expect(self.page.locator("#question-counter")).to_contain_text("Question 1")
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#question-counter")).to_contain_text("Question 2")
        self.page.locator('[data-jump="0"]').click()
        expect(self.page.locator("#question-counter")).to_contain_text("Question 1")

    def test_roadmap_toggle_clear_history_and_reset_setup(self):
        self.page.locator("#toggle-roadmap").click()
        expect(self.page.locator("#roadmap-panel")).to_be_visible()
        self.page.locator("#toggle-roadmap-secondary").click()
        expect(self.page.locator("#roadmap-panel")).to_be_hidden()
        self.choose_mode("exam")
        self.page.locator("#count-select").select_option("5")
        self.start()
        self.page.locator(f'[data-jump="{self.page.locator("[data-jump]").count() - 1}"]').click()
        self.page.locator("#finish-quiz").click()
        expect(self.page.locator("#results-screen")).to_be_visible()
        self.page.locator("#reset-setup").click()
        expect(self.page.locator("#home-screen")).to_be_visible()
        expect(self.page.locator('[data-mode="learn"]')).to_have_attribute("aria-pressed", "true")
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.locator("#clear-history").click()
        expect(self.page.locator("#stat-attempts")).to_have_text("0")

    def test_timer_toggle_and_exit_confirmation(self):
        self.choose_mode("practice")
        self.page.locator("#timed-toggle").check()
        self.start()
        expect(self.page.locator("#timer-wrap")).to_be_visible()
        self.page.once("dialog", lambda dialog: dialog.dismiss())
        self.page.locator("#exit-quiz").click()
        expect(self.page.locator("#quiz-screen")).to_be_visible()
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.locator("#exit-quiz").click()
        expect(self.page.locator("#home-screen")).to_be_visible()

    def test_saved_review_filter_and_retry_button(self):
        self.choose_mode("practice")
        self.page.locator("#count-select").select_option("5")
        self.start()
        self.page.locator("#flag-question").click()
        self.page.locator(f'[data-jump="{self.page.locator("[data-jump]").count() - 1}"]').click()
        self.page.locator("#finish-quiz").click()
        expect(self.page.locator("#results-screen")).to_be_visible()
        self.page.locator("#review-filter").select_option("saved")
        expect(self.page.locator("#review-list .review-card")).to_have_count(1)
        self.page.locator("#review-focus").click()
        expect(self.page.locator("#review-filter")).to_have_value("saved")
        self.page.locator("#retry-quiz").click()
        expect(self.page.locator("#quiz-screen")).to_be_visible()
        expect(self.page.locator("#question-title")).not_to_be_empty()

    def test_saved_review_action_starts_with_the_saved_question_pool(self):
        self.choose_mode("practice")
        self.page.locator("#count-select").select_option("5")
        self.start()
        saved_title = self.page.locator("#question-title").inner_text()
        self.page.locator("#flag-question").click()
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.locator("#exit-quiz").click()
        self.page.locator('[data-module="review"]').first.click()
        expect(self.page.locator("#learning-title")).to_have_text("Review queue")
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(1)
        self.page.locator("#practice-saved-questions").click()
        expect(self.page.locator("#available-count")).to_contain_text("1 saved questions selected")
        self.start()
        expect(self.page.locator("#question-title")).to_have_text(saved_title)

    def test_export_review_downloads_text_file(self):
        self.choose_mode("practice")
        self.page.locator("#count-select").select_option("5")
        self.start()
        self.page.locator(f'[data-jump="{self.page.locator("[data-jump]").count() - 1}"]').click()
        self.page.locator("#finish-quiz").click()
        with self.page.expect_download() as download_info:
            self.page.locator("#download-review").click()
        download = download_info.value
        self.assertEqual(download.suggested_filename, "opslab-session-review.txt")


    def test_catalog_has_all_subjects_and_honest_counts(self):
        expect(self.page.locator("#subject-grid .subject-card")).to_have_count(11)
        expect(self.page.locator("#catalog-count")).to_contain_text("1,020 scored")
        expect(self.page.locator("#catalog-count")).to_contain_text("304 interview")
        self.page.locator("#subject-search").fill("network")
        expect(self.page.locator("#subject-grid .subject-card")).to_have_count(1)
        self.page.locator('[data-subject="networking"]').click()
        expect(self.page.locator("#topic-select")).to_have_value("networking")
        expect(self.page.locator("#topic-help")).to_contain_text("90 scored")

    def test_new_subjects_work_in_every_session_mode(self):
        topics = ["linux", "networking", "sre", "systems", "aws", "terraform", "docker", "ansible", "git", "observability"]
        for topic in topics:
            with self.subTest(topic=topic):
                self.page.locator("#topic-select").select_option(topic)
                self.choose_mode("learn")
                expect(self.page.locator("#topic-select")).to_have_value(topic)
                self.page.locator("#start-quiz").click()
                expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(30)
                self.page.locator("#back-from-learning").click()
                self.choose_mode("practice")
                self.page.locator("#level-select").select_option("easy")
                self.page.locator("#type-select").select_option("all")
                self.page.locator("#count-select").select_option("5")
                expect(self.page.locator("#available-count")).to_contain_text("24 questions")
                self.start()
                self.page.keyboard.press("1")
                self.page.locator("#check-answer").click()
                expect(self.page.locator("#question-feedback")).to_be_visible()
                self.page.once("dialog", lambda dialog: dialog.accept())
                self.page.locator("#exit-quiz").click()
                self.choose_mode("exam")
                self.start()
                self.page.keyboard.press("1")
                self.page.locator("#check-answer").click()
                expect(self.page.locator("#question-feedback")).to_be_hidden()
                self.page.once("dialog", lambda dialog: dialog.accept())
                self.page.locator("#exit-quiz").click()
                self.choose_mode("interview")
                expect(self.page.locator("#available-count")).to_contain_text("8 questions")
                self.start()
                expect(self.page.locator("#interview-answer-area")).to_be_visible()
                self.page.once("dialog", lambda dialog: dialog.accept())
                self.page.locator("#exit-quiz").click()
                self.choose_mode("learn")

    def test_library_switching_and_search_do_not_leak_other_subjects(self):
        self.page.locator("#start-quiz").click()
        self.page.locator("#learning-topic").select_option("linux")
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(30)
        self.page.locator("#learning-search").fill("inode")
        expect(self.page.locator("#learning-content-list")).to_contain_text("Inodes")
        self.page.locator("#learning-search").fill("no-such-concept-xyz")
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(0)
        expect(self.page.locator("#learning-content-detail")).to_contain_text("No content matches")
        self.page.locator("#learning-search").fill("")
        self.page.locator("#learning-topic").select_option("kubernetes")
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(6)
        self.page.locator('#learning-module-nav [data-module="scenarios"]').click()
        expect(self.page.locator("#learning-content-list .learning-item")).to_have_count(38)

    def test_partial_pack_failure_keeps_other_subjects_usable(self):
        self.page.route("**/data/linux.json", lambda route: route.fulfill(status=503, body="Unavailable"))
        self.page.reload(wait_until="networkidle")
        expect(self.page.locator("#catalog-warning")).to_contain_text("Linux")
        expect(self.page.locator("#subject-grid .subject-card")).to_have_count(10)
        self.choose_mode("practice")
        self.start()

    def test_all_pack_failure_has_recoverable_error(self):
        self.page.route("**/data/*-learning.json", lambda route: route.fulfill(status=503, body="Unavailable"))
        self.page.reload(wait_until="networkidle")
        expect(self.page.locator("#app-error")).to_be_visible()
        expect(self.page.locator("#start-quiz")).to_be_disabled()
        self.page.unroute("**/data/*-learning.json")
        self.page.locator("#reload-app").click()
        expect(self.page.locator("#start-quiz")).to_be_enabled()

    def test_mobile_catalog_and_library_fit_viewport(self):
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.assertFalse(self.page.evaluate("document.documentElement.scrollWidth > innerWidth"))
        self.page.locator('[data-subject="sre"]').click()
        self.page.locator("#start-quiz").click()
        expect(self.page.locator("#learning-content-detail")).to_be_visible()
        self.assertFalse(self.page.evaluate("document.documentElement.scrollWidth > innerWidth"))

    def test_storage_failure_does_not_prevent_practice(self):
        self.page.add_init_script("Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); };")
        self.page.reload(wait_until="networkidle")
        self.choose_mode("practice")
        self.page.locator("#topic-select").select_option("linux")
        self.start()
        expect(self.page.locator("#question-title")).not_to_be_empty()


if __name__ == "__main__":
    unittest.main(verbosity=2)

