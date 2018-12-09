// Precision function
export let Precision: any = {};
Precision.round = (number, precision): number => {
  const factor = Math.pow(10, precision);
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

// A helper function to sanitize innput  html strings that are
export function escapeHtml(text: string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return (text = text.replace(/[&<>"']/g, function(m) {
    return map[m];
  }));
}

export function escapeObjectProperties(object: any) {
  Object.keys(object).map(key => {
    if (typeof object[key] === 'string') {
      object[key] = escapeHtml(object[key]);
    }
  });
  return object;
}
