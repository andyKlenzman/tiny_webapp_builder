A super light weight, MVC personal accountability app with some extensible components for future project development.

UI
Structure
/model
  model.js      // State, DB access, app status
  streaks.js    // Pure business logic (streak calculations, no DOM)

/view
  view.js       // DOM creation

/controller
  controller.js // Orchestration: events, formatting, calls to Model/View
