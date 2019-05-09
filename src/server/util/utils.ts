export class Utils {
  static swapId(object: any): any {
    [object._id, object.id] = [object.id, object._id];
    return object;
  }

  static round(number: number, precision: number = 2): number {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }
}
