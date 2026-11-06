/**
 * AI Robot (Noores, Sketchfab) v1 named-node/semantic-material contract.
 * Source is Sketchfab Standard, NOT CC0. No third-party model binaries in this package.
 */
export const aiRobotGroups = ['Head','Antenna','Chest','Hips','Neck','MidSpine','LeftArm','RightArm','LeftWheel','RightWheel'] as const;
export type AiRobotGroupName = typeof aiRobotGroups[number];
export const aiRobotMaterialRoles = {
  Head:'shell',
  chestMat:'shell',
  hipsMat:'shell',
  ForeArmMat:'shell',
  EyeBorder:'accent',
  wheelHolderMAt:'accent',
  light:'glow',
  Eyes:'eyes',
  Ears:'preserve',
  Antenna:'preserve',
  Holder:'preserve',
  Neck:'preserve',
  midSpineMat:'preserve',
  Wheelmat:'preserve',
  HandCircleMat:'preserve',
  AfterCircleMat:'preserve',
  FingersMAt:'preserve',
  HandMad:'preserve',
} as const;
export type AiRobotMaterialRole = typeof aiRobotMaterialRoles[keyof typeof aiRobotMaterialRoles];
export function materialRole(name:string):AiRobotMaterialRole {
  if (Object.prototype.hasOwnProperty.call(aiRobotMaterialRoles,name)){
    return aiRobotMaterialRoles[name as keyof typeof aiRobotMaterialRoles];
  }
  return 'preserve';
}
