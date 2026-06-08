export interface CalculatedUser {
  name: string;
  dob: string;
  powerGroup: string;
}

export interface CalculatedConnection {
  id: string;
  name: string;
  dob: string;
  powerGroup: string;
  compatibility: number;
  dateCompatibility?: number;
  monthCompatibility?: number;
  datePowerName?: string;
  monthPowerName?: string;
}

function digitalRoot(n: number): number {
  if (n === 0) return 0;
  return (n - 1) % 9 + 1;
}

function getPowerName(n: number): string {
  if ([1, 2, 7].includes(n)) return 'Siriyas';
  if ([3, 6, 9].includes(n)) return 'Vega';
  if ([4, 5, 8].includes(n)) return 'Orion';
  return 'Unknown';
}

export function getPowerDetails(dob: string) {
  if (!dob) return { datePowerName: 'Unknown', monthPowerName: 'Unknown', dateRoot: 0, monthRoot: 0 };
  
  const dateObj = new Date(dob);
  if (isNaN(dateObj.getTime())) return { datePowerName: 'Unknown', monthPowerName: 'Unknown', dateRoot: 0, monthRoot: 0 };
  
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  
  const dateRoot = digitalRoot(day);
  const monthRoot = digitalRoot(month);
  
  return {
    datePowerName: getPowerName(dateRoot),
    monthPowerName: getPowerName(monthRoot),
    dateRoot,
    monthRoot
  };
}

export function calculatePowerGroup(dob: string): string {
  const { datePowerName, monthPowerName, dateRoot, monthRoot } = getPowerDetails(dob);
  if (datePowerName === 'Unknown') return 'Unknown';
  return `Date: ${datePowerName} ${dateRoot}, Month: ${monthPowerName} ${monthRoot}`;
}

export function calculateCompatibility(userDob: string, friendDob: string) {
  if (!userDob || !friendDob) {
    return { compatibility: 0, dateCompatibility: 0, monthCompatibility: 0 };
  }
  
  const userPowers = getPowerDetails(userDob);
  const friendPowers = getPowerDetails(friendDob);
  
  // Using the assumption: Same group = 100%, Different group = 50%
  const dateCompatibility = userPowers.datePowerName === friendPowers.datePowerName ? 100 : 50;
  const monthCompatibility = userPowers.monthPowerName === friendPowers.monthPowerName ? 100 : 50;
  
  const compatibility = Math.round((dateCompatibility + monthCompatibility) / 2);
  
  return { compatibility, dateCompatibility, monthCompatibility };
}

export function generateReport(user: { name: string, dob: string }, friends: { id: string, name: string, dob: string }[]): { calculatedUser: CalculatedUser, connections: CalculatedConnection[] } {
  const calculatedUser = {
    name: user.name,
    dob: user.dob,
    powerGroup: calculatePowerGroup(user.dob)
  };

  const connections = friends.map(f => {
    const friendPowerDetails = getPowerDetails(f.dob);
    const compat = calculateCompatibility(user.dob, f.dob);
    
    return {
      id: f.id,
      name: f.name,
      dob: f.dob,
      powerGroup: calculatePowerGroup(f.dob),
      compatibility: compat.compatibility,
      dateCompatibility: compat.dateCompatibility,
      monthCompatibility: compat.monthCompatibility,
      datePowerName: friendPowerDetails.datePowerName,
      monthPowerName: friendPowerDetails.monthPowerName
    };
  });

  return { calculatedUser, connections };
}
