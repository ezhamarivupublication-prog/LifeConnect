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
}

// MOCK CALCULATION: Replace this with the actual algorithm
export function calculatePowerGroup(dob: string): string {
  // Mock logic: Just returning a power group based on the day of the month
  if (!dob) return 'Unknown';
  const day = new Date(dob).getDate();
  if (day <= 6) return 'Nova';
  if (day <= 12) return 'Vega';
  if (day <= 18) return 'Siriyas';
  if (day <= 24) return 'Orion';
  return 'Lyra';
}

// MOCK CALCULATION: Replace this with the actual algorithm
export function calculateCompatibility(userDob: string, friendDob: string): number {
  // Mock logic: Generate a deterministic percentage based on the dates
  if (!userDob || !friendDob) return 0;
  
  const userTime = new Date(userDob).getTime();
  const friendTime = new Date(friendDob).getTime();
  
  // Create a pseudo-random but consistent number between 0 and 100
  const hash = Math.abs(userTime - friendTime);
  const percentage = (hash % 101); 
  
  return percentage;
}

export function generateReport(user: { name: string, dob: string }, friends: { id: string, name: string, dob: string }[]): { calculatedUser: CalculatedUser, connections: CalculatedConnection[] } {
  const calculatedUser = {
    name: user.name,
    dob: user.dob,
    powerGroup: calculatePowerGroup(user.dob)
  };

  const connections = friends.map(f => {
    return {
      id: f.id,
      name: f.name,
      dob: f.dob,
      powerGroup: calculatePowerGroup(f.dob),
      compatibility: calculateCompatibility(user.dob, f.dob)
    };
  });

  return { calculatedUser, connections };
}
