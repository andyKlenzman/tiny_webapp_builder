import { dataAddGroup } from "../core_data";

const coreDataTest = () => {
    // add a group
    dataAddGroup("new_group_1");
    dataAddGroup("new_group_2");
    dataAddGroup("new_group_3");
    // console.assert(add(2, 3) === 5, 'Test fehlgeschlagen: add(2, 3) sollte 5 ergeben');

}



export const runTests = () => {
    coreDataTest();
}