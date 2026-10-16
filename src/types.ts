export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number; // in MZN (Meticais)
  description: string;
  details?: string;
  image?: string; // User's own photo uploaded from device
  badge?: string;
  available: boolean;
  videoUrl?: string;
  hasVideo?: boolean;
  videoDuration?: string;
  gallery?: string[];
  mediaStorageId?: string;
}

export interface GalleryMediaItem {
  id: string;
  title: string;
  modelName: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  modelId?: string;
  price?: number;
  uploadedFromDevice?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  locationType: 'domicilio' | 'hotel' | 'espaco_cliente' | 'agencia';
  paymentMethod: 'm-pesa' | 'emola' | 'dinheiro';
  observations: string;
  agencyPhone: '864368486' | '878872648';
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  serviceType: string;
  comment: string;
  verified: boolean;
  avatarInitials?: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  subscribedAt?: number;
  expiresAt?: number;
  customerPhone?: string;
  transactionRef?: string;
}

export interface AgencyConfig {
  name: string;
  tagline: string;
  phone1: string;
  phone2: string;
  address: string;
  city: string;
  operatingHours: string;
  paymentMethods: string[];
  heroImage?: string;
  subscriptionPrice: number; // in MZN, for 1 month access to Catálogo
  emolaNumber: string; // e-Mola account number
  emolaName: string; // e-Mola account name
  emolaQrImage?: string; // Imagem do QR Code / Recebimento e-Mola
  mpesaNumber?: string; // Número M-Pesa oficial
  mpesaName?: string; // Nome titular da conta M-Pesa
  mpesaQrImage?: string; // Imagem do QR Code / Recebimento M-Pesa
}
