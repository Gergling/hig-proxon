import { store } from "../data/load";
import { View } from "../data/types";

export const load = async (data: View) => {
  console.log('+++ Loading...');
  try {
    await store(data);
  } catch (e) {
    console.error('! Loading failed:', e);
    throw e;
  }
};
