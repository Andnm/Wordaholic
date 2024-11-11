export interface DataSaleType {
  income: Income;
  courses: Courses;
  newUsers: NewUsers;
}

export interface Income {
  totalIncomeCurrent: number;
  totalIncomePrevious: number;
  differencePercent: number;
}

export interface Courses {
  totalCoursesCurrent: number;
  totalCoursesPrevious: number;
  differencePercent: number;
}

export interface NewUsers {
  totalNewUsersCurrent: number;
  totalNewUsersPrevious: number;
  differencePercent: number;
}


export interface RevenueWeekType {
  dayOfWeekRevenue: number[]
}


