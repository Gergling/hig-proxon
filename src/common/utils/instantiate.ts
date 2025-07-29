import { BaseConstructorFunction } from "../../types/utils";

export const instantiate = <
  TParam,
  TInstance,
  ConstructorFunction extends BaseConstructorFunction<TParam, TInstance>,
>(
  Class: ConstructorFunction,
  props: TParam,
): InstanceType<ConstructorFunction> => new Class(props) as InstanceType<ConstructorFunction>;
