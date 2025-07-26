import { runTrackingTests} from "./middleware/trackingTests";
import runDataTests  from "./modules/dataTests"
import runUITests from "./modules/uiTests";






export const runTests = () => {
  // module tests
  // runDataTests();
  // runUITests();


  // middleware tests
  runTrackingTests();
  
};
