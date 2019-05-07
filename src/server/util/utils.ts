export class Utils {
  static swapId(objects: any[] | any): any[] | any {
    if (Array.isArray(objects)) {
      objects.forEach((doc: any) => {
        if (doc._id) {
          [doc._id, doc.id] = [doc.id, doc._id];
        }
      });
      return objects;
    } else {
      if (objects._id) {
        [objects._id, objects.id] = [objects.id, objects._id];
      }
      return objects;
    }
  }

  static round(number: number, precision: number = 2): number {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }
}
