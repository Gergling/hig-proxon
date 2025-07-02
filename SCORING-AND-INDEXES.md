# Scoring and Indexes

## Overview

| Category | Id  | Version | Dependencies | Overview |
| -------- | --- | ------- | ------------ | -------- |
| GYM      | EMS | 0NTN    | -            | Exercise Muscle Score
| GYM      | MSI | 1       | GYM-EMS-X    | Minimum Session Activity
| GYM      | MAI | 1       | GYM-MSI-1    | Minimum Activity Index
| GYM      | TQI | 1       | -            | Training Quality Index
| PHY      | MMI | 1       | -            | Muscle Mass Index
| PHY      | BFI | 1       | -            | Body Fat Index
| PHY      | BBI | 1       | PHY-BFI-1, PHY-MMI-1 | Bodybuilding Index
| PHY      | QAI | 1       | PHY-BBI-X    | Quality Assurance Index

## Anatomy

The main parts of a scoring standard are as follows:

* Category, e.g. GYM, PHY
* Id, e.g. EMS, MMI
* Version, e.g. 0NTN, 1

The signature for a scoring standard is therefore:

`[Category]-[Id]-[Version]`

Examples:

* GYM-EMS-0NTN
* PHY-MMI-1

The name of a scoring standard would be:

`[Category]-[Id]`

Examples:

* GYM-EMS
* PHY-MMI

## Breakdown

### GYM-EMS-0NTN: Exercise Muscle Score

#### Spec

#### Relevance

### GYM-MSI-1: Minimum Session Activity

#### Spec

#### Relevance

### GYM-MAI-1: Minimum Activity Index

#### Spec

#### Relevance

### GYM-TQI-1: Training Quality Index

#### Spec
The total of valid *sets* divided by the total *sets* in a *session*.

#### Relevance

### PHY-MMI-1: Muscle Mass Index

#### Spec

#### Relevance

### PHY-BFI-1: Body Fat Index

#### Spec

#### Relevance

### PHY-BBI-1: Bodybuilding Index

#### Spec

#### Relevance

### PHY-QAI-1: Quality Assurance Index

#### Spec

#### Relevance



Measurements in a week, maxed at 4. Scales to 1.




GYM-EMS-0-NTN:
This is defined by the list of muscle groups and how they relate to exercises, scoring 1 for focus and 0.5 for stabiliser. The exercises have the score.
Exercise Muscle Score. Gauges the value of the exercise by muscle groups trained. Likely indicates the effort required as a side effect.


Total EMS-X (any version) in a session maxed at 5. Scaled to 1.


GYM-MAI-1
The product of GYM-MSI-1 for each of 7 days of gym sessions and the number of sessions maxed at 2. Scaled to 1.








Breakdown
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
EMS
0-NTN
None

Spec
Relevance
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
MSI
1
GYM-EMS-X

Spec
Relevance
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
EMS
0-NTN
None

Spec
Relevance
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
EMS
0-NTN
None

Spec
Relevance
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
EMS
0-NTN
None

Spec
Relevance
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
EMS
0-NTN
None

Spec
Relevance
GYM-EMS-0-NTN
Category
Id
Version
Dependencies
GYM
EMS
0-NTN
None

Spec
Relevance
