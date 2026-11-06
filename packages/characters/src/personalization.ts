export const robotPalettes = {
  ocean: { shell: '#37C9F5', trim: '#164FB0', light: '#B7F3FF' },
  violet: { shell: '#A88BFF', trim: '#6548C5', light: '#E1D6FF' },
  candy: { shell: '#FF80BF', trim: '#AA3F82', light: '#FFE0F1' },
  lime: { shell: '#B9E94D', trim: '#428A47', light: '#F4FFD8' },
  sunshine: { shell: '#FFD65A', trim: '#A96718', light: '#FFF2BA' },
} as const;
export type RobotPalette = keyof typeof robotPalettes;
export const robotExpressions = ['happy','thinking','excited','surprised','sleepy','cool','oops','celebrate'] as const;
export type RobotExpression = typeof robotExpressions[number];
export type RobotPreferences = Readonly<{palette:RobotPalette; expression:RobotExpression}>;
export const defaultRobotPreferences:RobotPreferences = {palette:'ocean', expression:'happy'};
export function parseRobotPreferences(value:unknown):RobotPreferences {
  if(typeof value!=='object'||value===null)return {...defaultRobotPreferences};
  const v=value as Record<string,unknown>;
  const palette=typeof v.palette==='string'&&Object.hasOwn(robotPalettes,v.palette)?v.palette as RobotPalette:defaultRobotPreferences.palette;
  const expression=typeof v.expression==='string'&&robotExpressions.includes(v.expression as RobotExpression)?v.expression as RobotExpression:defaultRobotPreferences.expression;
  return {palette,expression};
}
