To address the constant stream of ideas that I have to build little browser utilties and webpages, I've thought to build a custom, super light weight, and extensible JS library to support these projects.

Data

- Server: Includes APIs for my favorite tools for building a server, creating a unified API between them.
- Data: Contains an application specification for the use of this.

UI

- Contains components for building super simple UI components

Things I'd like to build with it

- Accountability
- Tracking
- Note cards
- Career Timeline and portfolio
- Coole  animationen buzuglich mit Wissenshaft


For influence

The general idea behind this code structure is to enforce a degree of hierarchy into software modules to make understanding where which part of the required functionality is implemented easier.

As a rule of thumb, components of the same level may interact with each other, but it is not allowed for a lower level components to call an API from a higher level module.