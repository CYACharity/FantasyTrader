/* ============================================================
 *  STOCKS LEAGUE — quiz tracker
 *  Non-invasive: wraps each module's existing checkQuiz() so the
 *  page looks and behaves exactly the same, but the FIRST answer
 *  to each question is recorded, and once every question has been
 *  answered the score is saved to Supabase (quiz_results), which
 *  also marks the lesson complete when the user passes (>=70%).
 * ============================================================ */
(function () {
  function start() {
    const moduleId = location.pathname.split('/').pop().replace('.html', '');
    const answers = {};        // qNum -> boolean (first attempt only)
    let saved = false;

    const orig = window.checkQuiz;
    if (typeof orig !== 'function') return;   // no quiz on this page

    window.checkQuiz = function (num, el, isCorrect) {
      if (!(num in answers)) answers[num] = !!isCorrect;   // lock first answer
      try { orig.apply(this, arguments); } catch (e) {}

      const total = document.querySelectorAll('.quiz-q').length || Object.keys(answers).length;
      if (!saved && Object.keys(answers).length >= total && total > 0) {
        saved = true;
        const score = Object.values(answers).filter(Boolean).length;
        if (window.SL && SL.saveQuizResult) {
          SL.saveQuizResult(moduleId, score, total);
        }
        showResult(score, total);
      }
    };
  }

  // A small, theme-neutral banner so the learner sees their result.
  function showResult(score, total) {
    const pct = Math.round((score / total) * 100);
    const pass = pct >= 70;
    const bar = document.createElement('div');
    bar.setAttribute('role', 'status');
    bar.style.cssText =
      'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;' +
      'padding:14px 22px;border-radius:12px;font-family:inherit;font-weight:600;' +
      'box-shadow:0 10px 30px rgba(0,0,0,.35);color:#fff;' +
      'background:' + (pass ? '#16a34a' : '#b45309') + ';';
    bar.textContent = (pass ? 'Passed — ' : 'Keep going — ') +
      'you scored ' + score + '/' + total + ' (' + pct + '%). Progress saved.';
    document.body.appendChild(bar);
    setTimeout(() => { bar.style.transition = 'opacity .5s'; bar.style.opacity = '0'; }, 4000);
    setTimeout(() => bar.remove(), 4600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
