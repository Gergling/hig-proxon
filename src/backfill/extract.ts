// import { extractAll } from "../data";

// export const extract = async () => {
//   console.log('+++ Extracting...');
//   try {
//     const dtos = await extractAll();
//     const extractionReport = Object.entries(dtos).reduce((report, [key, value]) => {
//       return {
//         ...report,
//         [key]: value.length,
//       };
//     }, {})
//     console.log('= Extracted.')
//     console.log(extractionReport)
//     return dtos;
//   } catch(e) {
//     console.error('! Extraction failed:', e);
//     throw e;
//   }
// }
