import { GymTripProps } from "../api-types";

export const getIndexes = (trips: GymTripProps[]) => {
  const { process } = trips.reduce(({
    process
  }, trip) => {
    // QAI: Skipping for this because it's 1.
    // EMS: Exercise muscle score. Sets and sessions sum this.
      // For 0.1: We can assume the threshold is 270 in a 3-week period.
      // To begin with twe'll get these from the Notion DB, so the
      // version should be considered 0.1-NTN until we make operations to
      // update the database with appropriate scoring.
    // MSI: Trip score maxed at 5.
    // MAI: Product of MSI and trips in last 7 days. 

    // The Process Index, which will be based on whether the individual
    // set scores based on the hardcoded threshold.
    // Minimum activity index is the mean of:
      // The number of gym sessions in the week divided by 2 maxed at 1.
      // The muscle score divided by 5 max at 1.
    return {
      process: 0,
    }
  }, {
    process: 0,
  });
};

// TODO: Need to think about how to balance the scoring system.
// Ideally we'd keep call muscle score data here and then update the
// exercises database with the individual scores.
// We should be hardcoding a complete list of muscle groups and exercises,
// and those should update the existing database when we choose it.
// We should also be hardcoding the muscle scores for the exercises.
// Also need to turn something like Greg's Muscle Scoring System into a
// hilarious but apt acronym.
// This way we can version the calculation.
// Ultimately we can keep that in a separate repo.
// DO NOT try to implement all of that at once.

// Also, ideally we need to try and scale the progress index, which is
// currently at 75%, or 30 muscle score points a session, or 270 in a
// 3-week period.
// Also, we'll need to be able to calculate that threshold against the
// performance rating for muscle mass and body fat.

// The minimum threshold should probably be scored differently, such as
// 3 exercise sessions a week, scoring at least 5 points each.
// This is the Minimum Activity Index.

// Currently a gym trip needs to score at least 30.

// Indexes can start with a spec and a version each.

// So each index can have:
// A spec and version. The READMEs could have their own repos ofc...
// gas-[code without versions] e.g. gas-gym-ems.
// Possibly a single repo package for all of them, since it's overkill
// otherwise.


// GYM-EMS-0.1:
// Exercise muscle score is defined by a list of muscle groups.
// An exercise with a list of focus muscle groups scores 1 for each.
// An exercise with a list of stabiliser muscle groups scores 0.5 for each.
// The exercise GYM-EMS-0 score is the sum of focus and stabiliser scores.

// GYM-MSI-0.1:
// Minimum Session Activity Index is the product of:
// The GYM-EMS-0.1 of the gym session divided by 5 max at 1.

// GYM-MAI-0.1:
// Minimum activity index is the product of:
  // The number of gym sessions in the previous 7-day period divided by
  // 2 maxed at 1.
  // The GYM-MSI-0.1 of the gym session.

// GYM-QAI-0.1:
// Quality Assurance Index.
// We probably don't really need this because the EMS data isn't based on
// data gathered so much as work done, unlike the physical measurements
// which can be missed, the logging is required to do the exercises.
// This is currently 1.

// PHY-MMI-0.1:
// Physical Muscle Mass Index.
// This requires a minimum and maximum. The minimum should be at least the
// safety threshold. The maximum should be up to the safety threshold.
// Mine is set to 50kg and 80kg. A 5kg range is acceptable at the maximum
// before dropping to 0.
// Otherwise it's an interpolation.

// PHY-BFI-0.1:
// Physical Body Fat Index.
// This requires a minimum and maximum. These should be based on the most
// up to date health service or equivalent authority thresholds.
// Mine is set to 9% and 25%.
// It's a negative interpolation.
// I can probably tolerate 8% for now, but then it must drop down to 0.

// PHY-BBI-0.1:
// Physical Body Building Index.
// This is simply the mean of the PHY-MMI-0.1 and PHY-BFI-0.1.

// PHY-QAI-0.1:
// Quality Assurance Index.
// Total measurements in a week, maxed at 4.

// TODO: Performance threshold.
// When the BBI consistently increases and not just because the fat is
// dropping off. How to measure... probably check the MMI is also
// increasing. Both MMI AND BBI must be increasing. 
// This is scaled in terms of the GYM-EMS-0.1 in a 3-week period.
// Should also have a minimum set of measurements, so maybe 4 physical
// measurements per week and 3 gym scores.
// Scale against the QAIs?
