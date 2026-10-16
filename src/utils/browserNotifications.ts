/**
 * Browser Notifications & Audio Chime System for New Orders.
 * Dispatches native browser notification when a new order is placed/logged.
 */

import { OrderLog } from '../types.ts';

/**
 * Play a gentle luxury chime sound using Web Audio API (no external audio files needed).
 */
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Chime note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Chime note 2: G#5 (830.61 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);

    // Chime note 3: B5 (987.77 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(987.77, now + 0.25);
    gain3.gain.setValueAtTime(0.25, now + 0.25);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.25);
    osc3.stop(now + 1.1);
  } catch (e) {
    console.debug('Audio chime unable to play:', e);
  }
}

/**
 * Check if the browser supports native notifications.
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission from administrator.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Failed to request notification permission', err);
    return false;
  }
}

/**
 * Send a Browser Notification when a new order is logged in localStorage.
 */
export function sendOrderBrowserNotification(order: OrderLog, agencyName: string = 'Boas e limpas'): void {
  // Always trigger the chime audio feedback for immediate responsiveness
  playNotificationChime();

  if (!isNotificationSupported()) {
    console.warn('Browser notifications not supported in this environment');
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const itemsList = order.itemsSummary.map((i) => `${i.quantity}x ${i.name}`).join(', ');
  const totalStr = order.totalAmount.toLocaleString('pt-MZ');

  const title = `🚨 Novo Pedido Recebido: ${order.customerName} (${totalStr} MZN)`;
  const options: NotificationOptions = {
    body: `📍 ${order.customerAddress}\n📱 Contato: ${order.customerPhone}\n🛍️ Itens: ${itemsList}\n💳 Pagamento: ${order.paymentMethod.toUpperCase()}`,
    tag: `order-${order.id}`,
    icon: '/favicon.ico',
    requireInteraction: true,
  };

  try {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (err) {
    console.error('Failed to create notification instance', err);
  }
}
