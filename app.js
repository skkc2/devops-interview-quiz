(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const LEVELS = [
    {id:"easy",label:"Easy",detail:"Build confidence with core concepts",minutes:15},
    {id:"medium",label:"Medium",detail:"Apply knowledge to everyday work",minutes:25},
    {id:"mediumHard",label:"Medium hard",detail:"Reason through real operational problems",minutes:35},
    {id:"hard",label:"Hard",detail:"Practice senior-level and exam-style decisions",minutes:45}
  ];
  const MODE_LABELS = {learn:"Learn",practice:"Practice",exam:"Exam simulation",interview:"Interview"};
  const TYPE_LABELS = {concept:"Core concept",command:"Command interpretation",scenario:"Troubleshooting scenario","multi-select":"Select all that apply","trade-off":"Trade-offs & design",interview:"Interview prompt"};
  const TOPIC_LABELS = {kubernetes:"Kubernetes",linux:"Linux",systems:"Systems administration",terraform:"Terraform",aws:"AWS",ansible:"Ansible",docker:"Docker",git:"Git & CI/CD",sre:"SRE & incident response",observability:"Observability",networking:"Networking"};
  const LEVEL_HELP = {easy:"Build confidence with the essentials.",medium:"Apply concepts to common operational work.",mediumHard:"Reason through multi-signal production problems.",hard:"Practise high-impact decisions and senior-level trade-offs."};
  const STORAGE_KEY = "opslab-history-v2";
  const FLAG_KEY = "opslab-saved-questions-v1";
  const state = {level:"easy",topic:"kubernetes",type:"all",count:"all",mode:"learn",timed:false,questions:[],answers:[],submitted:[],ratings:{},flags:new Set(),index:0,remaining:0,timer:null,startedAt:0,finished:false,sessionId:0,reviewFilter:"all",reviewSavedOnly:false,forcedQuestionIds:null,session:null};
  let curated = [];
  let subjects = [];
  let learningSearch = "";
  let learning = null;
  let activeModule = "concepts";
  let selectedContentId = null;
  const MODULE_META = {
    concepts:{title:"Concepts",description:"Build mental models across your selected subject and connect them to operational decisions."},
    commands:{title:"Commands",description:"Understand what each command or query does, when to use it, and how to read its flags and output."},
    scenarios:{title:"Scenarios & debugging",description:"Work through an incident: inspect evidence, diagnose the cause, apply a scoped fix and verify recovery."},
    timed:{title:"Timed drills",description:"Configure an exam-style session with a real eligible question count and timer."},
    review:{title:"Review queue",description:"Revisit questions you saved for review."},
    interviews:{title:"Interview prompts",description:"Practise structured answers and compare them with a sample answer and checklist."},
    "followups":{title:"Follow-ups",description:"Explore interviewer probes connected to a parent prompt and practise answering them with context."}
  };
  let history = [];
  let historyAvailable = true;

  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl = (url) => { try { const u = new URL(url); return u.protocol === "https:" ? u.href : ""; } catch (_) { return ""; } };
  const shuffled = (items) => { const out=items.slice(); for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];} return out; };
  const levelMeta = () => LEVELS.find(x=>x.id===state.level)||LEVELS[0];
  const topicLabel = (id) => TOPIC_LABELS[id] || id.replace(/[-_]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
  const isInterview = (q) => q.type === "interview";
  const isMulti = (q) => q.type === "multi-select";
  const correctSet = (q) => Array.isArray(q.correct) ? q.correct.slice().sort((a,b)=>a-b) : [q.correct];
  const sameAnswer = (a,b) => Array.isArray(a) && Array.isArray(b) ? a.length===b.length && a.slice().sort((x,y)=>x-y).every((x,i)=>x===b.slice().sort((x,y)=>x-y)[i]) : a===b;
  const isAnswered = (i) => {
    const q=state.questions[i], a=state.answers[i];
    if(!q) return false;
    if(isInterview(q)) return Boolean((a && String(a).trim()) || state.ratings[q.id]);
    if(isMulti(q)) return Array.isArray(a) && a.length>0;
    return Number.isInteger(a);
  };
  const isCorrect = (i) => {
    const q=state.questions[i], a=state.answers[i];
    return q && !isInterview(q) && isAnswered(i) && sameAnswer(Array.isArray(a)?a:[a], correctSet(q));
  };
  const htmlRefs = (q) => (q.references||[]).map(r=>{const url=safeUrl(r.url);return url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title||"Official documentation")+' ↗</a>':"";}).join("");
  function loadHistory(){
    try { const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); history=Array.isArray(raw)?raw:[]; }
    catch(_){history=[];historyAvailable=false;}
    try { const saved=JSON.parse(localStorage.getItem(FLAG_KEY)||"[]"); if(Array.isArray(saved))state.flags=new Set(saved); }
    catch(_){state.flags=new Set();}
  }
  function persistHistory(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(history.slice(-50)));historyAvailable=true;}catch(_){historyAvailable=false;}}
  function persistFlags(){try{localStorage.setItem(FLAG_KEY,JSON.stringify([...state.flags]));}catch(_){}}
  function setScreen(name){
    document.querySelectorAll(".screen").forEach(el=>{const active=el.id===name+"-screen";el.classList.toggle("is-active",active);el.hidden=!active;});
    window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  const SUBJECT_ICONS = {
    kubernetes:'<path d="M24 5l15 7 4 16-11 13H16L5 28l4-16z"/><circle cx="24" cy="24" r="9"/><path d="M24 10v28M10 24h28M14 14l20 20M14 34l20-20"/>',
    linux:'<path d="M16 34c-4-6-3-13 0-16 0-10 16-10 16 0 3 3 4 10 0 16"/><ellipse cx="24" cy="28" rx="9" ry="11"/><path d="M20 19l4 3 4-3-4-3zM16 35l-6 5h12M32 35l6 5H26"/><circle cx="21" cy="14" r="1"/><circle cx="27" cy="14" r="1"/>',
    networking:'<circle cx="24" cy="12" r="6"/><circle cx="12" cy="35" r="6"/><circle cx="36" cy="35" r="6"/><path d="M21 18l-6 11M27 18l6 11M18 35h12"/>',
    sre:'<path d="M24 5l16 6v12c0 10-16 19-16 19S8 33 8 23V11z"/><path d="M12 24h7l4-9 5 18 4-9h5"/>',
    systems:'<rect x="8" y="7" width="32" height="14" rx="3"/><rect x="8" y="27" width="32" height="14" rx="3"/><path d="M22 14h11M22 34h11"/><circle cx="15" cy="14" r="1"/><circle cx="15" cy="34" r="1"/>',
    aws:'<path d="M13 30a9 9 0 010-18 12 12 0 0123 4 7 7 0 010 14H13zM12 37c8 6 18 6 26-1M32 35l7 1-2 7"/>',
    terraform:'<path d="M8 8l13 7v14L8 22zM25 17l13-7v14l-13 7zM25 34l13-7v14l-13 7z"/>',
    docker:'<path d="M5 25h31c4 0 6-3 7-6 2 8-3 20-20 20C12 39 7 34 5 25zM11 24v-7h7v7M20 24v-7h7v7M29 24V10h7v14M20 17v-7h7v7"/><circle cx="14" cy="30" r="1"/>',
    ansible:'<path d="M10 39L24 8l14 31-20-12M17 29h14"/>',
    git:'<circle cx="14" cy="10" r="5"/><circle cx="14" cy="38" r="5"/><circle cx="35" cy="12" r="5"/><path d="M14 15v18M35 17v3c0 10-21 4-21 13"/>',
    observability:'<path d="M4 24s7-13 20-13 20 13 20 13-7 13-20 13S4 24 4 24z"/><circle cx="24" cy="24" r="7"/><path d="M24 3v4M24 41v4"/>'
  };
  function renderCatalog(){
    const query=$("subject-search").value.trim().toLowerCase();
    const visible=subjects.filter(s=>s.label.toLowerCase().includes(query));
    $("catalog-count").textContent=subjects.length+" subjects · "+curated.filter(q=>!isInterview(q)).length.toLocaleString()+" scored questions · "+curated.filter(isInterview).length+" interview prompts";
    $("subject-grid").innerHTML=visible.length?visible.map(subject=>{
      const selected=state.topic===subject.id;
      const label={systems:"Systems",sre:"SRE",git:"Git & CI/CD"}[subject.id]||subject.label;
      return '<button type="button" class="subject-card '+(selected?'selected':'')+'" data-subject="'+esc(subject.id)+'" aria-label="'+esc(subject.label)+'" aria-pressed="'+selected+'"><span class="subject-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">'+SUBJECT_ICONS[subject.id]+'</svg></span><strong>'+esc(label)+'</strong></button>';
    }).join(""):'<p class="empty-state">No matching subjects. Try Linux, AWS, SRE or networking.</p>';
  }
  function poolForSetup(){
    let all=curated;
    if(Array.isArray(state.forcedQuestionIds)){
      all=all.filter(q=>state.forcedQuestionIds.includes(q.id));
      if(state.mode==="interview")return all.filter(isInterview);
      if(state.mode==="practice"||state.mode==="exam")return all.filter(q=>!isInterview(q));
      return all;
    }
    all=all.filter(q=>q.level===state.level);
    if(state.topic!=="all")all=all.filter(q=>q.topic===state.topic);
    if(state.type!=="all")all=all.filter(q=>q.type===state.type);
    if(state.mode==="interview")all=all.filter(isInterview);
    if(state.mode==="practice"||state.mode==="exam")all=all.filter(q=>!isInterview(q));
    return all;
  }
  function renderSetup(){
    $("level-select").value=state.level;
    $("level-help").textContent=LEVEL_HELP[state.level];
    document.querySelectorAll("[data-mode]").forEach(btn=>{const selected=btn.dataset.mode===state.mode;btn.classList.toggle("selected",selected);btn.setAttribute("aria-pressed",String(selected));});
    const learnMode=state.mode==="learn";
    const reviewSelection=Array.isArray(state.forcedQuestionIds);
    const allTopics=new Set(curated.map(q=>q.topic));
    if(state.topic!=="all"&&!allTopics.has(state.topic))state.topic="all";
    $("topic-select").innerHTML='<option value="all">All available subjects</option>'+[...allTopics].sort((a,b)=>topicLabel(a).localeCompare(topicLabel(b))).map(t=>'<option value="'+esc(t)+'">'+esc(topicLabel(t))+(learnMode?' (curated)':'')+'</option>').join("");
    $("topic-select").value=state.topic;
    $("level-select").parentElement.hidden=learnMode||reviewSelection;
    $("topic-select").parentElement.hidden=reviewSelection;
    $("type-select").disabled=learnMode;
    $("type-select").title=learnMode?"Learn opens the subject learning library. Use the module navigation to choose content.":"Filter eligible questions by type.";
    $("type-select").parentElement.hidden=learnMode||reviewSelection;
    $("count-select").parentElement.hidden=learnMode;
    const availablePool=curated.filter(q=>reviewSelection?state.forcedQuestionIds.includes(q.id):(q.level===state.level&&(state.topic==="all"||q.topic===state.topic)));
    const eligible=availablePool.filter(q=>{
      if(state.mode==="interview")return isInterview(q);
      if(state.mode==="practice"||state.mode==="exam")return !isInterview(q);
      return true;
    });
    const typeCounts=new Map();
    eligible.forEach(q=>typeCounts.set(q.type,(typeCounts.get(q.type)||0)+1));
    [...$("type-select").options].forEach(opt=>{if(opt.value!=="all")opt.disabled=!typeCounts.has(opt.value);});
    if(state.mode==="interview"){$("type-select").value="interview";state.type="interview";}
    else if(state.type==="interview"&&(state.mode==="practice"||state.mode==="exam"))state.type="all";
    else if(state.type!=="all"&&!typeCounts.has(state.type))state.type="all";
    if(state.mode==="learn")state.type="all";
    $("type-select").value=state.type;
    const pool=poolForSetup();
    const count=pool.length;
    const countSelect=$("count-select");
    const choices=[{value:"5",label:"5 questions"},{value:"10",label:"10 questions"},{value:"20",label:"20 questions"},{value:"30",label:"30 questions"},{value:"all",label:"All available ("+count+")"}];
    countSelect.innerHTML=choices.map(c=>'<option value="'+c.value+'" '+(c.value!=="all"&&Number(c.value)>count?"disabled":"")+'>'+esc(c.label)+'</option>').join("");

    countSelect.value=state.count;
    $("timed-toggle").checked=state.timed;
    $("timer-control").hidden=state.mode==="learn"||state.mode==="interview";
    if(state.mode==="exam"&&!state.timed){$("timer-control").querySelector("strong").textContent="Run without a timer";$("timer-control").querySelector("small").textContent="Turn on a timer for exam pacing.";}
    else{$("timer-control").querySelector("strong").textContent="Run with a timer";$("timer-control").querySelector("small").textContent="Useful for exam pacing and interview pressure.";}
    if(learnMode){
      const lessons=state.topic==="all"?(learning?.lessons||[]):(learning?.lessons||[]).filter(x=>x.topic===state.topic);
      const commands=state.topic==="all"?(learning?.commands||[]):(learning?.commands||[]).filter(x=>x.topic===state.topic);
      $("available-count").textContent=lessons.length+" lessons and "+commands.length+" command guides available in the curated learning library";
      $("start-quiz").disabled=!learning;
      $("start-quiz").innerHTML='Open learning library <span aria-hidden="true">→</span>';
      $("setup-message").textContent=learning?"Choose Concepts or Commands in the learning path below to browse material.":"Learning content is loading.";
    }else{
      $("available-count").textContent=reviewSelection?count+" saved questions selected":count+" questions match your session";
      $("start-quiz").disabled=count===0||(state.count!=="all"&&Number(state.count)>count);
      $("start-quiz").innerHTML='Start session <span aria-hidden="true">→</span>';
      $("setup-message").textContent=count===0?(reviewSelection?"No saved graded questions are available for practice yet. Save a graded question first.":state.mode==="interview"?"No interview prompts match these filters yet. Choose another subject or clear the question type.":"No questions match these filters. Choose another subject, difficulty or type."):state.count!=="all"&&Number(state.count)>count?"Only "+count+" questions match these filters. Choose a smaller count or broaden your filters.":reviewSelection?"This session is limited to your saved questions.":"";
    }
    const topicQuestions=curated.filter(q=>state.topic==="all"||q.topic===state.topic);
    const graded=topicQuestions.filter(q=>!isInterview(q)).length;
    $("topic-help").textContent=graded+" scored questions · "+(topicQuestions.length-graded)+" self-reviewed interview prompts across all difficulties.";
    renderCatalog();
    renderHistory();
  }
  function learningItemsForModule(module){
    const topicOK=item=>state.topic==="all"||item.topic===state.topic;
    if(module==="concepts")return (learning?.lessons||[]).filter(topicOK);
    if(module==="commands")return (learning?.commands||[]).filter(topicOK);
    if(module==="scenarios")return (learning?.debugging||[]).filter(topicOK);
    if(module==="review"){
      const all=curated;
      return all.filter(q=>state.flags.has(q.id)&&topicOK(q));
    }
    if(module==="interviews")return curated.filter(q=>isInterview(q)&&topicOK(q));
    if(module==="followups")return curated.filter(isInterview).filter(topicOK).flatMap(q=>(q.followUps||[]).map((prompt,index)=>({id:q.id+"-followup-"+index,title:prompt,summary:"Follow-up to: "+(q.title||q.question),topic:q.topic,level:q.level,parent:q})));
    if(module==="timed")return [{id:"timed-drill-entry",title:"Configure a timed exam drill",summary:"Choose a difficulty, eligible question types and a count. The setup shows the exact number available before you start."}];
    if(module==="self-assessment")return [{id:"self-assessment-entry",title:"Review your answer quality",summary:"Use the interview checklist to assess structure, evidence, trade-offs and verification. Review your recent interview sessions for ratings."}];
    return [];
  }
  function renderLearningModule(module){
    activeModule=MODULE_META[module]?module:"concepts";
    const meta=MODULE_META[activeModule];
    $("learning-title").textContent=meta.title;
    $("learning-description").textContent=meta.description;
    $("learning-subject-pill").textContent=state.topic==="all"?"All subjects":topicLabel(state.topic);
    document.querySelectorAll("[data-module]").forEach(btn=>{
      const active=btn.dataset.module===activeModule;
      btn.classList.toggle("selected",active);
      btn.setAttribute("aria-current",active?"page":"false");
    });
    $("learning-topic").innerHTML='<option value="all">All available subjects</option>'+subjects.map(s=>'<option value="'+esc(s.id)+'">'+esc(s.label)+'</option>').join("");
    $("learning-topic").value=state.topic;
    const query=learningSearch.trim().toLowerCase();
    const items=learningItemsForModule(activeModule).filter(item=>!query||[item.title,item.question,item.summary,item.objective,item.symptom,item.command,item.definition,item.purpose,...(item.sections||[]).map(s=>s.body)].filter(Boolean).join(" ").toLowerCase().includes(query));
    $("learning-content-count").textContent=items.length+" "+(activeModule==="concepts"?"lessons":activeModule==="commands"?"command guides":activeModule==="review"?"saved questions":activeModule==="interviews"?"interview prompts":activeModule==="scenarios"?"scenarios":"available action")+" available";
    $("learning-content-list").innerHTML=items.length?items.map(item=>'<button type="button" class="learning-item '+(item.id===selectedContentId?"selected":"")+'" data-content-id="'+esc(item.id)+'"><strong>'+esc(item.title||item.question||"Learning item")+'</strong><small>'+esc(item.summary||item.objective||item.symptom||topicLabel(item.topic||"kubernetes"))+'</small></button>').join(""):'<div class="empty-state"><strong>No items here yet.</strong><p>Clear your search or choose another subject. Every subject has concepts, command guides, worked scenarios and interview prompts. Save practice questions to populate your review queue.</p></div>';
    if(!items.length){$("learning-content-detail").innerHTML='<p class="empty-state">No content matches this module and subject selection yet.</p>';selectedContentId=null;return;}
    let item=items.find(x=>x.id===selectedContentId)||items[0];
    selectedContentId=item.id;
    document.querySelectorAll("[data-content-id]").forEach(btn=>{const selected=btn.dataset.contentId===selectedContentId;btn.classList.toggle("selected",selected);btn.setAttribute("aria-current",selected?"true":"false");});
    renderLearningDetail(activeModule,item);
  }
  function renderLearningDetail(module,item){
    const detail=$("learning-content-detail");
    const refs=(item.references||[]).map(ref=>{const url=safeUrl(ref.url);return url?'<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(ref.title||"Documentation")+' ↗</a></li>':"";}).join("");
    let body="";
    if(module==="concepts"){
      body=(item.sections||[]).map(section=>'<section class="lesson-section"><h3>'+esc(section.heading)+'</h3><p>'+esc(section.body)+'</p></section>').join("")+(item.command?'<section class="lesson-section"><h3>Related command</h3><pre class="question-code"><code>'+esc(item.command)+'</code></pre><p>Replace uppercase placeholders before use. The Commands module explains common tools and their output.</p></section>':'');
    }else if(module==="commands"){
      body='<section class="lesson-section"><h3>What it is</h3><p>'+esc(item.definition)+'</p></section><div class="command-example"><span>'+esc(item.kind||"Command")+'</span><code>'+esc(item.command)+'</code><button type="button" class="button button-secondary" id="copy-learning-command">Copy command</button></div><section class="lesson-section"><h3>Why use it</h3><p>'+esc(item.purpose)+'</p></section><section class="lesson-section"><h3>How to read it</h3><p>'+esc(item.interpretation)+'</p></section><section class="lesson-section"><h3>Illustrative output</h3><pre class="question-code"><code>'+esc(item.expectedOutput)+'</code></pre></section><section class="lesson-section"><h3>Before you run it</h3><p>'+esc(item.environment)+'</p></section>';
    }else if(module==="scenarios"){
      body='<section class="lesson-section"><h3>The issue</h3><p>'+esc(item.symptom)+'</p></section>'+(item.steps||[]).map((step,i)=>'<section class="lesson-section"><h3>'+ (i+1)+'. '+esc(step.action)+'</h3>'+(step.command?'<pre class="question-code"><code>'+esc(step.command)+'</code></pre>':'')+'<p>'+esc(step.evidence)+'</p></section>').join("");
    }else if(module==="interviews"){
      body='<p class="learning-summary">'+esc(item.question)+'</p><section class="lesson-section"><h3>Sample answer</h3><p>'+esc(item.sampleAnswer||item.explanation||"Use a structured answer: context, evidence, action, verification.")+'</p></section><section class="lesson-section"><h3>Self-review checklist</h3><ul>'+(item.answerChecklist||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section><section class="lesson-section"><h3>Follow-up prompts</h3><ul>'+(item.followUps||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section><button type="button" class="button button-primary" id="practise-interview-prompt">Practise an interview prompt →</button>';
    }else if(module==="review"){
      body='<p class="learning-summary">'+esc(item.question||item.title)+'</p><section class="lesson-section"><h3>Explanation</h3><p>'+esc(item.explanation||"Review the official reference and explain the reasoning in your own words.")+'</p></section><div class="takeaway-box"><div><strong>Takeaway</strong><p>'+esc(item.takeaway||"Return to the underlying concept and verify it in a safe lab.")+'</p></div></div><button type="button" class="button button-primary" id="practice-saved-questions">Build practice from saved questions →</button>';
    }else if(module==="followups"){
      body='<p class="learning-summary">'+esc(item.title)+'</p><section class="lesson-section"><h3>Parent interview prompt</h3><p>'+esc(item.parent.title||item.parent.question)+'</p></section><section class="lesson-section"><h3>Sample answer to build from</h3><p>'+esc(item.parent.sampleAnswer||item.parent.explanation||"Structure your response around evidence, trade-offs and verification.")+'</p></section><section class="lesson-section"><h3>Self-check</h3><ul>'+(item.parent.answerChecklist||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section><button type="button" class="button button-primary" id="practice-followup">Practise interview responses →</button>';
    }else if(module==="timed"){
      body='<p class="learning-summary">'+esc(item.summary)+'</p><ul><li>Choose Easy, Medium, Medium hard or Hard.</li><li>Choose 5, 10, 20, 30, or all eligible questions.</li><li>Exam mode hides explanations until the results review.</li></ul><button type="button" class="button button-primary" id="configure-timed-drill">Configure timed drill →</button>';
    }else{
      const interviews=curated.filter(isInterview);
      body='<p class="learning-summary">'+esc(item.summary)+'</p><section class="lesson-section"><h3>Use this checklist</h3><ul><li>State the impact and relevant constraints.</li><li>Explain which evidence you would gather and why.</li><li>Compare options and explain the safest next action.</li><li>Describe how you would verify recovery and prevent recurrence.</li></ul></section><section class="lesson-section"><h3>Available interview prompts</h3><p>'+interviews.length+' curated prompts currently include sample answers and self-review checklists. Your self-ratings are collected during interview sessions.</p></section><button type="button" class="button button-primary" id="open-interview-prompts">Browse interview prompts →</button>';
    }
    detail.innerHTML='<div class="learning-detail-overline">'+esc(MODULE_META[module].title)+' · '+esc(topicLabel(item.topic||"kubernetes"))+'</div><h2>'+esc(item.title||item.question||"Learning item")+'</h2>'+body+(refs?'<section class="lesson-section"><h3>References</h3><ul>'+refs+'</ul></section>':"");
    if(module==="commands"&&$("copy-learning-command"))$("copy-learning-command").addEventListener("click",()=>{const text=item.command;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>{$("copy-learning-command").textContent="Copied";}).catch(()=>{$("copy-learning-command").textContent="Copy unavailable";});}else{$("copy-learning-command").textContent="Copy unavailable";}});
    if(module==="scenarios"&&$("practice-this-scenario"))$("practice-this-scenario").addEventListener("click",()=>{state.topic=item.topic;state.mode="practice";state.type="scenario";state.level=item.level||state.level;setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});});
    if(module==="interviews"&&$("practise-interview-prompt"))$("practise-interview-prompt").addEventListener("click",()=>{state.topic=item.topic;state.mode="interview";state.type="interview";state.level=item.level||state.level;state.count="all";setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});});
    if(module==="review"&&$("practice-saved-questions"))$("practice-saved-questions").addEventListener("click",()=>{state.forcedQuestionIds=[...state.flags];state.mode="practice";state.topic="all";state.type="all";state.count="all";setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});});
    if(module==="timed"&&$("configure-timed-drill"))$("configure-timed-drill").addEventListener("click",()=>{state.mode="exam";state.timed=true;state.type="all";setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});});
    if(module==="followups"&&$("practice-followup"))$("practice-followup").addEventListener("click",()=>{state.mode="interview";state.type="interview";state.count="all";setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});});
  }
  function openLearningModule(module){
    activeModule=MODULE_META[module]?module:"concepts";
    selectedContentId=null;learningSearch="";$("learning-search").value="";
    renderLearningModule(activeModule);
    setScreen("learning");
  }
  function returnToSetupForModule(module){
    if(module==="review"){state.forcedQuestionIds=[...state.flags];state.mode="practice";state.topic="all";state.type="all";state.count="all";}
    else state.forcedQuestionIds=null;
    if(module==="concepts"){state.mode="practice";state.type="concept";state.count="all";}
    else if(module==="commands"){state.mode="practice";state.type=curated.some(q=>q.topic===state.topic&&q.type==="command"&&q.level===state.level)?"command":"all";state.count="all";}
    else if(module==="timed"){state.mode="exam";state.timed=true;state.type="all";state.count="all";}
    else if(module==="review"){state.mode="practice";state.type="all";state.count="all";}
    else if(module==="interviews"||module==="followups"){state.mode="interview";state.type="interview";state.count="all";}
    else if(module==="scenarios"){state.mode="practice";state.type="scenario";state.count="all";}
    setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});
  }
  function renderHistory(){
    const scored=history.filter(x=>Number.isFinite(x.score)&&x.graded>0);
    $("stat-attempts").textContent=history.length;
    $("stat-average").textContent=scored.length?Math.round(scored.reduce((s,x)=>s+x.score,0)/scored.length)+"%":"—";
    $("stat-best").textContent=scored.length?Math.max(...scored.map(x=>x.score))+"%":"—";
    const recent=history.slice(-5).reverse();
    $("recent-sessions").innerHTML=recent.length?recent.map(x=>'<div class="history-row"><span><strong>'+esc(x.modeLabel)+' · '+esc(x.levelLabel)+'</strong><small>'+esc(x.date)+' · '+esc(topicLabel(x.topic==="all"?"Mixed topics":x.topic))+'</small></span><span class="history-score">'+(x.graded?x.score+"%":"Interview")+'</span></div>').join(""):'<p class="empty-state">Your completed sessions will appear here. Progress stays in this browser.</p>';
    if(!historyAvailable)$("setup-message").textContent="Browser storage is unavailable; this session can still run, but progress may not persist.";
  }
  function buildSession(){
    const pool=shuffled(poolForSetup());
    const count=state.count==="all"?pool.length:Math.min(pool.length,Number(state.count)||10);
    state.questions=pool.slice(0,count).map(q=>{
      if(isInterview(q)||!Array.isArray(q.options)||q.options.length<2)return {...q};
      const options=q.options.map((text,index)=>({text,index}));
      const shuffledOptions=shuffled(options);
      return {...q,options:shuffledOptions.map(o=>o.text),correct:correctSet(q).map(idx=>shuffledOptions.findIndex(o=>o.index===idx)).sort((a,b)=>a-b)};
    });
    state.answers=new Array(state.questions.length).fill(null);
    state.submitted=new Array(state.questions.length).fill(false);
    state.ratings={};state.index=0;state.finished=false;state.sessionId++;state.startedAt=Date.now();
    state.remaining=Math.max(1,state.questions.length)*(state.mode==="exam"?75:60);
    state.session={id:state.sessionId,level:state.level,topic:state.topic,mode:state.mode,modeLabel:MODE_LABELS[state.mode],levelLabel:Array.isArray(state.forcedQuestionIds)?"Saved review":levelMeta().label,startedAt:state.startedAt};
  }
  function startQuiz(){
    if(state.mode==="learn"){openLearningModule(state.type==="command"?"commands":"concepts");return;}
    const available=poolForSetup().length;
    if(!available)return;
    if(state.count!=="all"&&Number(state.count)>available){$("setup-message").textContent="Your selected count is "+state.count+", but only "+available+" questions match. Choose a smaller count or broaden the filters.";return;}
    buildSession();setScreen("quiz");renderQuestion();
    if(state.timed&&(state.mode==="exam"||state.mode==="practice")){
      clearInterval(state.timer);renderTimer();
      const id=state.sessionId;
      state.timer=setInterval(()=>{if(state.sessionId!==id||state.finished){clearInterval(state.timer);return;}state.remaining--;renderTimer();if(state.remaining<=0)finishQuiz(true);},1000);
    }else{$("timer-wrap").hidden=true;}
  }
  function renderTimer(){
    $("timer-wrap").hidden=!state.timed;
    const min=Math.floor(state.remaining/60),sec=state.remaining%60;
    $("timer-value").textContent=min+":"+String(sec).padStart(2,"0");
    $("timer-wrap").classList.toggle("urgent",state.remaining<=60);
  }
  function renderQuestion(){
    const q=state.questions[state.index];if(!q)return;
    const answered=isAnswered(state.index),submitted=state.submitted[state.index];
    $("question-counter").textContent="Question "+(state.index+1)+" of "+state.questions.length;
    $("progress-caption").textContent=Math.round((state.index+1)/state.questions.length*100)+"% through";
    $("question-progress").max=state.questions.length;$("question-progress").value=state.index+1;
    $("quiz-mode-pill").textContent=MODE_LABELS[state.mode];$("quiz-level-pill").textContent=Array.isArray(state.forcedQuestionIds)?"Saved review":levelMeta().label;$("quiz-topic-pill").textContent=topicLabel(q.topic);
    $("question-type-pill").textContent=TYPE_LABELS[q.type]||"Knowledge check";$("question-level-pill").textContent=(q.level||state.level).toUpperCase();
    // Titles are catalog labels, never substitutes for the actual question.
    // Authored paragraphs separate the operational context from the final ask.
    const promptParts=q.question.split(/\n\s*\n/);
    const prompt=promptParts.pop();
    const context=[q.context,...promptParts].filter(Boolean).join("\n\n");
    $("question-title").textContent=prompt;
    $("question-objective").querySelector("p").textContent=q.objective||"Check your understanding, then explain the reasoning.";
    $("question-context").textContent=context;$("question-context").hidden=!context;
    $("question-code").hidden=!q.code;$("question-code").querySelector("code").textContent=q.code||"";
    $("selection-hint").textContent=isMulti(q)?"Select exactly "+correctSet(q).length+" answers, then check your selection.":isInterview(q)?"Use the notes field to structure an answer, or speak your response out loud.":"Choose one answer, then check your reasoning.";
    $("answer-options").hidden=isInterview(q);
    $("answer-options").innerHTML=isInterview(q)?"":q.options.map((opt,i)=>{
      const selected=Array.isArray(state.answers[state.index])?state.answers[state.index].includes(i):state.answers[state.index]===i;
      let cls="answer-option"+(selected?" selected":"");
      if(submitted&&state.mode!=="exam"&&!isInterview(q)){if(correctSet(q).includes(i))cls+=" answer-correct";else if(selected)cls+=" answer-incorrect";}
      return '<button type="button" class="'+cls+'" data-option="'+i+'" aria-pressed="'+selected+'" '+(submitted?"disabled":"")+'><span class="option-key">'+String.fromCharCode(65+i)+'</span><span>'+esc(opt)+'</span><span class="option-mark" aria-hidden="true">'+(selected?"✓":"")+'</span></button>';
    }).join("");
    $("interview-answer-area").hidden=!isInterview(q);
    $("interview-answer").value=isInterview(q)&&typeof state.answers[state.index]==="string"?state.answers[state.index]:"";
    $("interview-answer").disabled=Boolean(submitted);
    $("interview-self-check").hidden=!isInterview(q)||!submitted;
    $("interview-checklist").innerHTML=(q.answerChecklist||[]).map(x=>"<li>"+esc(x)+"</li>").join("");
    document.querySelectorAll("[data-rating]").forEach(b=>b.classList.toggle("selected",Number(b.dataset.rating)===state.ratings[q.id]));
    $("flag-question").setAttribute("aria-pressed",String(state.flags.has(q.id)));
    $("flag-question").innerHTML=(state.flags.has(q.id)?"★":"☆")+" "+(state.flags.has(q.id)?"Saved for review":"Save for review");
    $("previous-question").disabled=state.index===0;
    $("check-answer").hidden=submitted;
    $("next-question").hidden=!submitted||state.index===state.questions.length-1;
    $("finish-quiz").hidden=state.index!==state.questions.length-1;
    if(!submitted&&state.mode==="exam")$("check-answer").innerHTML='Save answer <span aria-hidden="true">✓</span>';
    else $("check-answer").innerHTML=(isInterview(q)?"Compare with a strong answer":state.mode==="exam"?"Save answer":"Check answer")+" <span aria-hidden=\"true\">↗</span>";
    $("check-answer").disabled=false;
    const showFeedback=submitted&&(state.mode!=="exam"||state.finished);
    $("question-feedback").hidden=!showFeedback;
    if(showFeedback)renderFeedback(q,state.index);
    $("sidebar-answered").textContent=state.submitted.filter(Boolean).length;
    $("sidebar-remaining").textContent=state.questions.length-state.submitted.filter(Boolean).length;
    renderJumpList();
  }
  function renderFeedback(q,i){
    const interview=isInterview(q),answered=isAnswered(i),correct=isCorrect(i);
    const status=$("feedback-status");
    if(interview){status.textContent="Self-assessment";status.className="feedback-status neutral";}
    else if(!answered){status.textContent="Not answered";status.className="feedback-status neutral";}
    else if(correct){status.textContent="Correct";status.className="feedback-status";}
    else{status.textContent="Review this";status.className="feedback-status incorrect";}
    $("feedback-explanation").textContent=q.explanation||"Review the official documentation and try to explain the reason behind this answer.";
    const answer=$("feedback-answer");
    if(interview){
      answer.hidden=false;answer.innerHTML="<strong>Example answer</strong><p>"+esc(q.sampleAnswer||q.takeaway||q.explanation)+"</p>";
      $("interview-checklist").innerHTML=(q.answerChecklist||[]).map(x=>"<li>"+esc(x)+"</li>").join("");
    }else if(isMulti(q)){
      answer.hidden=false;answer.innerHTML="<strong>Correct choices: </strong>"+correctSet(q).map(idx=>esc(String.fromCharCode(65+idx)+". "+q.options[idx])).join(" · ");
    }else{
      answer.hidden=false;answer.innerHTML="<strong>Correct answer: </strong>"+esc(q.options[correctSet(q)[0]]||"Not available");
    }
    $("feedback-takeaway").textContent=q.takeaway||"Explain how you would verify this behaviour in a real environment.";
    $("feedback-references").innerHTML=htmlRefs(q);
    $("feedback-followups").hidden=!(q.followUps&&q.followUps.length);
    $("followup-list").innerHTML=(q.followUps||[]).map(x=>"<li>"+esc(x)+"</li>").join("");
  }
  function renderJumpList(){
    $("question-jump-list").innerHTML=state.questions.map((q,i)=>{
      const cls=["jump-dot",i===state.index?"current":"",isAnswered(i)?"answered":"",state.flags.has(q.id)?"flagged":""].filter(Boolean).join(" ");
      return '<button type="button" class="'+cls+'" data-jump="'+i+'" aria-label="Go to question '+(i+1)+(isAnswered(i)?", answered":"")+(state.flags.has(q.id)?", saved for review":"")+'" aria-current="'+(i===state.index?"step":"false")+'">'+(i+1)+'</button>';
    }).join("");
  }
  function chooseOption(index){
    const q=state.questions[state.index];if(!q||state.submitted[state.index]||isInterview(q))return;
    if(isMulti(q)){
      const prev=Array.isArray(state.answers[state.index])?state.answers[state.index]:[];
      state.answers[state.index]=prev.includes(index)?prev.filter(x=>x!==index):prev.concat(index).sort((a,b)=>a-b);
    }else state.answers[state.index]=index;
    renderQuestion();
  }
  function submitAnswer(){
    const q=state.questions[state.index];if(!q)return;
    if(isInterview(q)){
      const text=$("interview-answer").value.trim();
      if(!text&&!state.ratings[q.id]){ $("quiz-live-feedback").textContent="Add a few notes or select a self-assessment rating before comparing."; $("interview-answer").focus();return; }
      state.answers[state.index]=text;state.submitted[state.index]=true;
    }else{
      if(!isAnswered(state.index)){ $("quiz-live-feedback").textContent=isMulti(q)?"Select at least one option before checking.":"Choose an answer before continuing.";return; }
      state.submitted[state.index]=true;
    }
    renderQuestion();
    $("quiz-live-feedback").textContent=state.mode==="exam"?"Answer saved. Feedback will be available after you finish.":"Answer saved. Review the explanation and takeaway.";
  }
  function moveQuestion(delta){
    const target=state.index+delta;if(target<0||target>=state.questions.length)return;
    state.index=target;renderQuestion();$("question-title").focus({preventScroll:true});
  }
  function toggleFlag(){
    const q=state.questions[state.index];if(!q)return;
    if(state.flags.has(q.id))state.flags.delete(q.id);else state.flags.add(q.id);
    persistFlags();renderQuestion();
  }
  function finishQuiz(auto=false){
    if(state.finished)return;
    state.finished=true;clearInterval(state.timer);state.timer=null;
    const qs=state.questions, graded=qs.map((q,i)=>({q,i})).filter(x=>!isInterview(x.q));
    const correct=graded.filter(x=>isCorrect(x.i)).length,incorrect=graded.filter(x=>isAnswered(x.i)&&!isCorrect(x.i)).length;
    const unanswered=graded.filter(x=>!isAnswered(x.i)).length;
    const score=graded.length?Math.round(correct/graded.length*100):null;
    const interviewCount=qs.filter(isInterview).length;
    const elapsed=Math.max(0,Math.round((Date.now()-state.startedAt)/1000));
    const byTopic={};
    qs.forEach((q,i)=>{const key=q.topic;byTopic[key] ||= {correct:0,graded:0,answered:0,total:0};const b=byTopic[key];b.total++;if(isAnswered(i))b.answered++;if(!isInterview(q)){b.graded++;if(isCorrect(i))b.correct++;}});
    const entry={id:Date.now()+"-"+state.sessionId,date:new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"}),level:state.level,levelLabel:Array.isArray(state.forcedQuestionIds)?"Saved review":levelMeta().label,topic:state.topic,mode:state.mode,modeLabel:MODE_LABELS[state.mode],score,graded:graded.length,correct,incorrect,unanswered,interviewCount,elapsed,byTopic};
    history.push(entry);persistHistory();state.session.result=entry;
    renderResults(entry,auto);renderHistory();setScreen("results");
  }
  function renderResults(entry,auto){
    const graded=entry.graded>0;
    $("result-score").textContent=graded?entry.score+"%":"—";
    $("result-score-label").textContent=graded?"Graded questions":"Interview practice";
    $("result-badge").textContent=auto?"Time complete":!graded?"Reflection session":entry.score>=85?"Strong performance":entry.score>=65?"Good progress":"Useful baseline";
    $("result-title").textContent=!graded?"Good answers are structured, not memorised.":entry.score>=85?"You’re building strong instincts.":entry.score>=65?"You’re making progress. Keep sharpening the why.":"Every miss is a useful next step.";
    $("result-summary").textContent=auto?"The timer ended. Review unanswered questions and use the explanations to identify your next study target.":!graded?"Open-ended prompts are self-assessed, not auto-scored. Compare your answer with the outline and checklist, then practise explaining it aloud.":entry.score>=85?"Review the missed or saved questions, then move up a level or switch to scenario practice.":"Focus on the questions you missed. Revisit the evidence, explain why the correct choice is safer, and retry after a short study session.";
    $("result-level").textContent=entry.levelLabel;$("result-mode").textContent=entry.modeLabel;$("result-duration").textContent=Math.floor(entry.elapsed/60)+"m "+entry.elapsed%60+"s";
    $("result-correct").textContent=entry.correct;$("result-incorrect").textContent=entry.incorrect;$("result-unanswered").textContent=entry.unanswered;$("result-flagged").textContent=qsFlaggedCount();
    const groups=Object.entries(entry.byTopic);
    $("result-breakdown").innerHTML=groups.map(([topic,b])=>{
      const pct=b.graded?Math.round(b.correct/b.graded*100):null;
      return '<div class="breakdown-row"><span class="breakdown-name">'+esc(topicLabel(topic))+'</span><div class="breakdown-bar"><div class="breakdown-fill" style="width:'+(pct||0)+'%"></div></div><span class="breakdown-score">'+(pct===null?"Reflect":pct+"%")+'</span></div>';
    }).join("");
    const weak=groups.filter(([,b])=>b.graded).sort((a,b)=>(a[1].correct/a[1].graded)-(b[1].correct/b[1].graded));
    const interviewQs=state.questions.filter(isInterview);
    let focus=weak.slice(0,3).map(([topic,b])=>'<div class="focus-item"><strong>'+esc(topicLabel(topic))+' · '+Math.round(b.correct/b.graded*100)+'%</strong><p>Revisit the explanations, then practise one troubleshooting scenario without looking at the options.</p></div>').join("");
    if(interviewQs.length)focus+=interviewQs.slice(0,2).map(q=>'<div class="focus-item"><strong>Interview prompt: '+esc(q.title||q.question)+'</strong><p>Use the answer checklist to practise a clear, structured response.</p></div>').join("");
    if(!focus)focus='<p>Your next step: revisit a saved question, explain the takeaway aloud, and test the concept in a small lab.</p>';
    $("weak-topics").innerHTML=focus;
    $("review-filter").value=state.reviewSavedOnly?"saved":"all";renderReview();
  }
  function qsFlaggedCount(){return state.questions.filter(q=>state.flags.has(q.id)).length;}
  function renderReview(){
    const filter=$("review-filter").value;
    const items=state.questions.map((q,i)=>({q,i})).filter(({q,i})=>filter==="saved"?state.flags.has(q.id):filter==="missed"?(isInterview(q)?!state.ratings[q.id]||state.ratings[q.id]<3:!isCorrect(i)):true);
    $("review-list").innerHTML=items.length?items.map(({q,i})=>{
      const interview=isInterview(q),correct=isCorrect(i),answered=isAnswered(i);
      const label=interview?"Self-assessed":!answered?"Unanswered":correct?"Correct":"Review";
      const cls=interview?"":!answered||!correct?"wrong":"";
      let answer="";
      if(interview){answer='<p><strong>Self-rating:</strong> '+esc(({1:"Needs work",2:"Getting there",3:"Interview ready"})[state.ratings[q.id]]||"Not rated")+'</p><details><summary>Compare with a strong answer</summary><p>'+esc(q.sampleAnswer||q.takeaway||q.explanation)+'</p>'+(q.answerChecklist||[]).map(x=>'<p>□ '+esc(x)+'</p>').join("")+'</details>';}
      else if(isMulti(q)){answer='<p class="review-answer">Correct choices: '+correctSet(q).map(idx=>esc(String.fromCharCode(65+idx)+". "+q.options[idx])).join(" · ")+'</p>';}
      else {answer='<p class="review-answer">Correct answer: '+esc(q.options[correctSet(q)[0]]||"Not available")+'</p>';}
      return '<article class="review-card"><div class="review-card-top"><span>'+esc(topicLabel(q.topic))+' · '+esc(TYPE_LABELS[q.type]||q.type)+'</span><strong class="'+cls+'">'+esc(label)+'</strong></div><h3>'+(i+1)+'. '+esc(q.title||q.question)+'</h3><p class="review-prompt">'+esc([q.context,q.question].filter(Boolean).join('\n\n'))+'</p><p>'+esc(q.explanation||"Review the official documentation and practise the concept.")+'</p>'+answer+'<p class="review-takeaway"><strong>Remember:</strong> '+esc(q.takeaway||"Explain how you would verify this in a real environment.")+'</p><div class="reference-links">'+htmlRefs(q)+'</div></article>';
    }).join(""):'<p class="empty-state">No questions match this review filter. Try another filter or save a question during the session.</p>';
  }
  function exportReview(){
    const lines=["OpsLab — session review","Mode: "+MODE_LABELS[state.mode],"Difficulty: "+levelMeta().label,"Topic: "+topicLabel(state.topic==="all"?"Mixed topics":state.topic),"Date: "+new Date().toLocaleString(),"",""];
    state.questions.forEach((q,i)=>{
      lines.push((i+1)+". "+[q.context,q.question].filter(Boolean).join("\n\n"), "Type: "+(TYPE_LABELS[q.type]||q.type), "Your answer: "+(isInterview(q)?(state.answers[i]||"(no notes)"):(Array.isArray(state.answers[i])?state.answers[i].map(idx=>q.options[idx]).join("; "):Number.isInteger(state.answers[i])?q.options[state.answers[i]]:"(unanswered)")));
      if(!isInterview(q))lines.push("Correct answer: "+(isMulti(q)?correctSet(q).map(idx=>q.options[idx]).join("; "):q.options[correctSet(q)[0]]));
      if(isInterview(q))lines.push("Self-rating: "+(({1:"Needs work",2:"Getting there",3:"Interview ready"})[state.ratings[q.id]]||"Not rated"),"Example answer: "+(q.sampleAnswer||""));
      lines.push("Explanation: "+(q.explanation||""),"Takeaway: "+(q.takeaway||""),"References: "+(q.references||[]).map(r=>r.url).join(", "),"");
    });
    const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="opslab-session-review.txt";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  function resetSetup(){
    clearInterval(state.timer);state.timer=null;state.finished=false;state.mode="learn";state.type="all";state.topic="kubernetes";state.count="all";state.timed=false;state.reviewSavedOnly=false;state.forcedQuestionIds=null;renderSetup();setScreen("home");
  }
  const motion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
  function wire(){
    $("subject-search").addEventListener("input",renderCatalog);
    $("subject-grid").addEventListener("click",e=>{const card=e.target.closest("[data-subject]");if(!card)return;state.topic=card.dataset.subject;state.forcedQuestionIds=null;renderSetup();$("setup-panel").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});$("topic-select").focus({preventScroll:true});});
    $("learning-topic").addEventListener("change",e=>{state.topic=e.target.value;selectedContentId=null;renderLearningModule(activeModule);});
    $("learning-search").addEventListener("input",e=>{learningSearch=e.target.value;selectedContentId=null;renderLearningModule(activeModule);});
    $("jump-to-setup").addEventListener("click",()=>{state.mode="learn";state.forcedQuestionIds=null;renderSetup();$("setup-panel").scrollIntoView({behavior:motion()});$("topic-select").focus({preventScroll:true});});
    document.querySelectorAll("[data-module]").forEach(btn=>btn.addEventListener("click",()=>openLearningModule(btn.dataset.module)));
    $("learning-content-list").addEventListener("click",e=>{const btn=e.target.closest("[data-content-id]");if(!btn)return;selectedContentId=btn.dataset.contentId;renderLearningModule(activeModule);if(window.matchMedia("(max-width:760px)").matches){$("learning-content-detail").scrollIntoView({behavior:motion(),block:"start"});$("learning-content-detail").focus({preventScroll:true});}});
    $("back-from-learning").addEventListener("click",()=>{setScreen("home");renderSetup();$("learning-path").scrollIntoView({behavior:"smooth"});});
    $("learning-back-setup").addEventListener("click",()=>{setScreen("home");renderSetup();$("setup-panel").scrollIntoView({behavior:"smooth"});});
    $("learning-start-practice").addEventListener("click",()=>returnToSetupForModule(activeModule));
    const showRoadmap=(open)=>{const panel=$("roadmap-panel");panel.hidden=!open;$("toggle-roadmap").setAttribute("aria-expanded",String(open));$("toggle-roadmap-secondary").setAttribute("aria-expanded",String(open));if(open){panel.scrollIntoView({behavior:motion(),block:"center"});panel.focus({preventScroll:true});}};
    $("toggle-roadmap").addEventListener("click",()=>showRoadmap(true));
    $("toggle-roadmap-secondary").addEventListener("click",()=>showRoadmap($("roadmap-panel").hidden));
    document.querySelector('.top-nav a[href="#learning-path"]').addEventListener("click",e=>{e.preventDefault();setScreen("home");$("learning-path").scrollIntoView({behavior:motion()});});
    document.querySelectorAll("[data-mode]").forEach(btn=>btn.addEventListener("click",()=>{state.forcedQuestionIds=null;state.mode=btn.dataset.mode;if(state.mode==="exam")state.timed=true;if(state.mode==="learn"||state.mode==="interview")state.timed=false;renderSetup();}));
    $("level-select").addEventListener("change",e=>{state.forcedQuestionIds=null;state.level=e.target.value;renderSetup();});
    $("topic-select").addEventListener("change",e=>{state.forcedQuestionIds=null;state.topic=e.target.value;renderSetup();});
    $("type-select").addEventListener("change",e=>{state.forcedQuestionIds=null;state.type=e.target.value;renderSetup();});
    $("count-select").addEventListener("change",e=>{state.count=e.target.value;renderSetup();});
    $("timed-toggle").addEventListener("change",e=>{state.timed=e.target.checked;if(state.mode==="exam"&&!state.timed){$("timer-control").querySelector("strong").textContent="Run without a timer";$("timer-control").querySelector("small").textContent="Turn on a timer for exam pacing.";}});
    $("start-quiz").addEventListener("click",startQuiz);
    $("answer-options").addEventListener("click",e=>{const b=e.target.closest("[data-option]");if(b)chooseOption(Number(b.dataset.option));});
    $("question-jump-list").addEventListener("click",e=>{const b=e.target.closest("[data-jump]");if(!b)return;state.index=Number(b.dataset.jump);renderQuestion();$("question-title").focus({preventScroll:true});});
    $("interview-answer").addEventListener("input",e=>{state.answers[state.index]=e.target.value;});
    $("interview-rating").addEventListener("click",e=>{const b=e.target.closest("[data-rating]");if(!b)return;const q=state.questions[state.index];state.ratings[q.id]=Number(b.dataset.rating);document.querySelectorAll("[data-rating]").forEach(x=>x.classList.toggle("selected",x===b));});
    $("check-answer").addEventListener("click",submitAnswer);
    $("previous-question").addEventListener("click",()=>moveQuestion(-1));
    $("next-question").addEventListener("click",()=>moveQuestion(1));
    $("finish-quiz").addEventListener("click",()=>finishQuiz(false));
    $("exit-quiz").addEventListener("click",()=>{if(window.confirm("Leave this session? Your current answers will not be saved as a completed result.")){clearInterval(state.timer);setScreen("home");renderSetup();}});
    $("flag-question").addEventListener("click",toggleFlag);
    $("review-filter").addEventListener("change",renderReview);
    $("retry-quiz").addEventListener("click",startQuiz);
    $("review-focus").addEventListener("click",()=>{$("review-filter").value="saved";renderReview();$("review-list").scrollIntoView({behavior:"smooth"});});
    $("reset-setup").addEventListener("click",resetSetup);
    $("new-session").addEventListener("click",resetSetup);
    $("download-review").addEventListener("click",exportReview);
    $("clear-history").addEventListener("click",()=>{if(window.confirm("Clear saved session history from this browser?")){history=[];persistHistory();renderHistory();}});
    $("reload-app").addEventListener("click",()=>window.location.reload());
    document.addEventListener("keydown",e=>{if(!$("quiz-screen").classList.contains("is-active")||e.altKey||e.ctrlKey||e.metaKey)return;const tag=(document.activeElement&&document.activeElement.tagName||"").toLowerCase();if(["input","textarea","select"].includes(tag))return;if(["1","2","3","4"].includes(e.key)&&!state.submitted[state.index])chooseOption(Number(e.key)-1);if(e.key==="ArrowRight"&&state.submitted[state.index])moveQuestion(1);if(e.key==="ArrowLeft")moveQuestion(-1);});
  }
  async function init(){
    loadHistory();wire();
    try{
      async function readJSON(path){
        const response=await fetch(path,{cache:"no-cache"});
        if(!response.ok)throw new Error(path+" returned HTTP "+response.status);
        return response.json();
      }
      const manifest=await readJSON("data/subjects.json");
      if(!manifest||!Array.isArray(manifest.subjects)||!manifest.subjects.length)throw new Error("The subject catalog is invalid.");
      const ids=new Set();
      for(const subject of manifest.subjects){
        if(!subject.id||ids.has(subject.id)||!/^data\/[a-z-]+\.json$/.test(subject.questions)||!/^data\/[a-z-]+\.json$/.test(subject.learning))throw new Error("Invalid or duplicate subject catalog entry.");
        ids.add(subject.id);
      }
      const loaded=await Promise.allSettled(manifest.subjects.map(async subject=>{
        const [pack,library]=await Promise.all([readJSON(subject.questions),readJSON(subject.learning)]);
        if(!Array.isArray(pack.questions)||!pack.questions.length||!pack.questions.every(q=>q.id&&q.topic===subject.id&&LEVELS.some(l=>l.id===q.level)&&TYPE_LABELS[q.type]&&Array.isArray(q.options)&&Array.isArray(q.correct)))throw new Error(subject.label+" has invalid questions.");
        if(!library||!["lessons","commands","debugging"].every(key=>Array.isArray(library[key])))throw new Error(subject.label+" has invalid learning content.");
        return {subject,pack,library};
      }));
      learning={lessons:[],commands:[],debugging:[]};
      const failed=[];
      loaded.forEach((result,index)=>{
        if(result.status!=="fulfilled"){failed.push(manifest.subjects[index].label);return;}
        const {subject,pack,library}=result.value;
        subjects.push(subject);curated.push(...pack.questions);
        for(const key of ["lessons","commands","debugging"])learning[key].push(...library[key].map(item=>({...item,topic:subject.id})));
      });
      if(!subjects.length)throw new Error("No subject packs could be loaded. Check your connection and retry.");
      if(new Set(curated.map(q=>q.id)).size!==curated.length)throw new Error("Question identifiers must be unique across subjects.");
      if(failed.length){$("catalog-warning").hidden=false;$("catalog-warning").textContent="Unavailable subjects: "+failed.join(", ")+". Other subjects are ready. Reload to retry.";}
      renderSetup();setScreen("home");
    }catch(err){
      $("app-error").hidden=false;$("app-error-message").textContent=err.message+" If you opened index.html directly, start a local static server and reload.";
      $("start-quiz").disabled=true;
      console.error("OpsLab failed to load question data",err);
    }
  }
  init();
})();
