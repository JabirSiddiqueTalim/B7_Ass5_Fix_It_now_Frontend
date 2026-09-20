export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentProvider = "STRIPE";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  address: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  technicianProfile?: TechnicianProfile | null;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  experienceYrs: number;
  hourlyRate: string;
  location: string | null;
  avgRating: number;
  totalReviews: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicianAvailability {
  id: string;
  technicianId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  technicianId: string;
  categoryId: string;
  title: string;
  description: string;
  price: string;
  durationMins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  address: string;
  notes: string | null;
  priceAtBooking: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  transactionId: string;
  amount: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt: string | null;
  failureReason: string | null;
  stripeSessionId: string | null;
  gatewayMeta: {
    sessionId: string;
    paymentIntentId: string | null;
    paymentStatus: string;
    amountTotal: number;
    currency: string;
    customerEmail: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errorDetails?: unknown;
}

export type RegisterRequest =
  | {
      role: "CUSTOMER";
      name: string;
      email: string;
      password: string;
      phone: string;
      address?: string;
      avatarUrl?: string;
    }
  | {
      role: "TECHNICIAN";
      name: string;
      email: string;
      password: string;
      phone: string;
      address?: string;
      avatarUrl?: string;
      bio?: string;
      skills?: string[];
      hourlyRate?: number;
      experienceYrs?: number;
      location?: string;
    };

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = User;

export interface UpdateTechnicianProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  experienceYrs?: number;
  location?: string;
}

export type AvailabilityRequest = Array<{
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}>;

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  durationMins?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateBookingRequest {
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
}

export type UpdateBookingStatusRequest =
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface CancelBookingRequest {
  cancelReason?: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
}

export interface CreatePaymentResponse {
  transactionId: string;
  paymentURL: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
}

// Enriched shapes returned by the API (technician views)

export interface TechnicianSummary {
  name: string;
  avatarUrl: string | null;
  address: string | null;
  phone: string;
  email: string;
  status: UserStatus;
}

export interface TechnicianListItem extends TechnicianProfile {
  userId: string;
  user: TechnicianSummary;
  services?: Service[];
  bookings?: Array<{
    status: BookingStatus;
    priceAtBooking: string;
    payment?: { status: PaymentStatus } | null;
    customer?: {
      name: string;
      phone: string;
      email: string;
      avatarUrl: string | null;
    };
  }>;
  reviews?: Array<{ rating: number; comment: string | null }>;
  _count?: {
    services: number;
    reviews: number;
    bookings: number;
  };
  availability?: TechnicianAvailability[];
}

export interface ServiceListItem extends Service {
  category?: Pick<Category, "name" | "description" | "iconUrl">;
  technician?: {
    user: {
      name: string;
      avatarUrl: string | null;
      email: string;
    };
    bio: string | null;
    location: string | null;
    avgRating: number;
    totalReviews: number;
  };
  bookings?: Array<{
    status: BookingStatus;
    address: string;
    priceAtBooking: string;
    payment?: { status: PaymentStatus } | null;
    review?: { rating: number; comment: string | null } | null;
  }>;
  _count?: { bookings: number };
}

export interface ServiceReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { name: string; avatarUrl: string | null };
}

export interface TechnicianReview {
  rating: number;
  comment: string | null;
}

export interface ServiceDetails extends Service {
  category?: Pick<Category, "name" | "description" | "iconUrl">;
  technician?: {
    user: {
      name: string;
      avatarUrl: string | null;
      email: string;
      phone: string;
    };
    bio: string | null;
    skills: string[];
    experienceYrs: number;
    location: string | null;
    avgRating: number;
    totalReviews: number;
    isVerified: boolean;
  };
  bookings?: Array<{ review?: ServiceReview | null }>;
  _count?: { bookings: number };
}

export interface CategoryListItem extends Category {
  services?: Array<{ title: string; description: string; price: string }>;
  _count?: { services: number };
}

export interface BookingListItem extends Booking {
  service?: {
    id: string;
    technicianId: string;
    categoryId: string;
    title: string;
    description: string;
    price: string;
    durationMins: number;
    isActive: boolean;
    category?: Pick<Category, "name" | "description">;
  };
  technician?: {
    user?: { name: string; email: string; phone: string };
    bio: string | null;
    location: string | null;
    experienceYrs: number;
    hourlyRate: string;
    totalReviews: number;
    avgRating: number;
  };
  customer?: { name: string; phone: string; email: string };
  payment?: { status: PaymentStatus; amount: string } | null;
  review?: { rating: number; comment: string | null } | null;
}

export interface PaymentListItem extends Payment {
  booking?: {
    id: string;
    status: BookingStatus;
    scheduledAt: string;
    address: string;
    priceAtBooking: string;
    service?: {
      id: string;
      title: string;
      description: string;
      price: string;
      durationMins: number;
    };
  };
}

export interface AdminUserListItem extends Omit<User, "technicianProfile"> {
  technicianProfile?: {
    id: string;
    avgRating: number;
    totalReviews: number;
    isVerified: boolean;
    location: string | null;
  } | null;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface AdminBookingListItem extends Booking {
  customer?: { name: string; email: string };
  technician?: { user?: { name: string; email: string } };
}

export interface AdminCategoryListItem extends Category {
  services?: Service[];
  _count?: { services: number };
}
