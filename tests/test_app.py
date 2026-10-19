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
        expect(self.page.locator("#available-count")).to_contain_text("questions match")

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
        expect(self.page.locator("#available-count")).to_contain_text("6 questions")
        self.choose_mode("exam")
        expect(self.page.locator("#available-count")).to_contain_text("6 questions")
        self.choose_mode("interview")
        expect(self.page.locator("#available-count")).to_contain_text("1 questions")
        expect(self.page.locator("#type-select")).to_have_value("interview")

    def test_requested_question_count_is_not_silently_reduced(self):
        self.choose_mode("practice")
        self.page.locator("#count-select").select_option("5")
        expect(self.page.locator("#start-quiz")).to_be_enabled()
        self.page.locator("#level-select").select_option("medium")
        expect(self.page.locator("#count-select")).to_have_value("5")
        self.page.locator("#type-select").select_option("scenario")
        expect(self.page.locator("#available-count")).to_contain_text("2 questions")
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
            "self-assessment": "Self-assessment",
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
        expect(self.page.locator("#available-count")).to_contain_text("2 questions")
        self.page.locator("#type-select").select_option("interview")
        expect(self.page.locator("#available-count")).to_contain_text("1 questions")
        self.choose_mode("exam")
        expect(self.page.locator("#type-select")).to_have_value("all")
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


if __name__ == "__main__":
    unittest.main(verbosity=2)
