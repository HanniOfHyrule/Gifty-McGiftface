export interface Birthday {
  id: number;
  name: string;
  lastName: string;
  dateOfBirth: string | null;
  Todo: 'WHATSAPP' | 'NEEDCARD' | 'NEEDPRESENT';
}

export interface UpcomingBirthday extends Birthday {
  daysUntilBirthday: number;
  birthdayThisYear: string;
  age: number | null;
}

export interface Statistics {
  total: number;
  upcomingCount: number;
  byMonth: MonthStatistic[];
  upcoming: UpcomingBirthday[];
}

export interface MonthStatistic {
  month: number;
  monthName: string;
  count: number;
}
