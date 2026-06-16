export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderNumber, customer, items, subtotal, shippingCost, total } = req.body;

  if (!orderNumber || !customer || !items || !customer.email || !customer.name) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'RESEND_API_KEY environment variable is not configured. Please add it to your Vercel project settings.' 
    });
  }

  const sellerEmail = process.env.SELLER_EMAIL || 'kakulatepradnyesh09@gmail.com';

  // Format items HTML for emails
  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #222;">
      <td style="padding: 10px 0; color: #F8F4EE; font-size: 14px;">${item.name} <span style="color: rgba(248, 244, 238, 0.5);">x${item.quantity}</span></td>
      <td style="padding: 10px 0; text-align: right; color: #C9A86A; font-size: 14px; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  // 1. Customer Email HTML
  const customerHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #222; border-radius: 12px; background-color: #121212; color: #F8F4EE;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #C9A86A; font-family: serif; font-size: 28px; letter-spacing: 3px; margin: 5px 0;">VELOURA</h2>
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: rgba(248, 244, 238, 0.4); margin: 0;">Handcrafted Candle Stories</p>
      </div>
      
      <div style="border-bottom: 1px solid #222; margin: 20px 0;"></div>
      
      <h3 style="color: #C9A86A; font-size: 18px; font-weight: normal; margin-top: 0;">Order Confirmed!</h3>
      <p style="font-size: 14px; line-height: 1.6; color: rgba(248, 244, 238, 0.8);">
        Thank you for shopping with us, <strong>${customer.name}</strong>. We've received your Cash on Delivery order and are preparing your candles with care.
      </p>

      <div style="background-color: rgba(201, 168, 106, 0.04); border: 1px solid rgba(201, 168, 106, 0.1); padding: 15px; border-radius: 8px; margin: 25px 0;">
        <span style="font-size: 12px; text-transform: uppercase; color: rgba(248, 244, 238, 0.4); display: block; margin-bottom: 3px;">Order Number</span>
        <span style="font-size: 18px; font-weight: bold; color: #C9A86A; font-family: monospace;">${orderNumber}</span>
      </div>

      <h4 style="color: #C9A86A; font-size: 15px; border-bottom: 1px solid #222; padding-bottom: 8px; margin-bottom: 10px; margin-top: 25px;">Order Summary</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #222;">
            <th style="text-align: left; padding-bottom: 8px; color: rgba(248, 244, 238, 0.4); font-size: 12px; font-weight: normal; text-transform: uppercase;">Item</th>
            <th style="text-align: right; padding-bottom: 8px; color: rgba(248, 244, 238, 0.4); font-size: 12px; font-weight: normal; text-transform: uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 15px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: rgba(248, 244, 238, 0.7); margin-bottom: 5px;">
          <span>Subtotal:</span>
          <span style="text-align: right; float: right; font-weight: bold;">₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: rgba(248, 244, 238, 0.7); margin-bottom: 10px; clear: both;">
          <span>Shipping:</span>
          <span style="text-align: right; float: right; font-weight: bold;">${shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
        </div>
        <div style="border-top: 1px dashed #222; padding-top: 10px; margin-top: 10px; font-size: 15px; color: #F8F4EE; clear: both; overflow: auto;">
          <span>Total Amount:</span>
          <span style="float: right; font-weight: bold; color: #C9A86A;">₹${total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <h4 style="color: #C9A86A; font-size: 15px; border-bottom: 1px solid #222; padding-bottom: 8px; margin-bottom: 10px; margin-top: 30px;">Shipping Details</h4>
      <p style="font-size: 13px; line-height: 1.6; color: rgba(248, 244, 238, 0.7); margin: 0;">
        <strong>Address:</strong> ${customer.address}, ${customer.city} - ${customer.pincode}<br />
        <strong>Phone:</strong> ${customer.phone}
      </p>

      <div style="border-top: 1px solid #222; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: rgba(248, 244, 238, 0.4);">
        If you have any questions or need to make changes, please contact us on WhatsApp at +91 9607643703.<br />
        <div style="margin-top: 15px; font-size: 11px; color: rgba(248, 244, 238, 0.3);">
          © 2026 Veloura Handcrafted Luxury Candles. All rights reserved.
        </div>
      </div>
    </div>
  `;

  // 2. Seller Alert Email HTML
  const sellerHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #222; border-radius: 12px; background-color: #121212; color: #F8F4EE;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #D98E32; font-family: serif; font-size: 24px; letter-spacing: 2px; margin: 5px 0;">VELOURA SELLER ALERT</h2>
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(248, 244, 238, 0.4); margin: 0;">New Order Dispatch Notice</p>
      </div>
      
      <div style="border-bottom: 1px solid #222; margin: 20px 0;"></div>
      
      <p style="font-size: 15px; color: #F8F4EE;">Hello,</p>
      <p style="font-size: 14px; line-height: 1.6; color: rgba(248, 244, 238, 0.8);">
        A new Cash on Delivery order was placed on the Veloura website. Please review the details below and prepare the dispatch.
      </p>

      <div style="background-color: rgba(217, 142, 50, 0.06); border: 1px solid rgba(217, 142, 50, 0.15); padding: 15px; border-radius: 8px; margin: 25px 0;">
        <span style="font-size: 11px; text-transform: uppercase; color: rgba(248, 244, 238, 0.4); display: block; margin-bottom: 3px;">Order Number</span>
        <span style="font-size: 18px; font-weight: bold; color: #D98E32; font-family: monospace;">${orderNumber}</span>
      </div>

      <h4 style="color: #D98E32; font-size: 15px; border-bottom: 1px solid #222; padding-bottom: 8px; margin-bottom: 10px; margin-top: 25px;">Customer Delivery Info</h4>
      <p style="font-size: 13px; line-height: 1.6; color: rgba(248, 244, 238, 0.7); margin: 0;">
        <strong>Customer Name:</strong> ${customer.name}<br />
        <strong>Phone Number:</strong> ${customer.phone}<br />
        <strong>Email Address:</strong> ${customer.email}<br />
        <strong>Shipping Address:</strong> ${customer.address}, ${customer.city} - ${customer.pincode}
      </p>

      <h4 style="color: #D98E32; font-size: 15px; border-bottom: 1px solid #222; padding-bottom: 8px; margin-bottom: 10px; margin-top: 25px;">Items Ordered</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #222;">
            <th style="text-align: left; padding-bottom: 8px; color: rgba(248, 244, 238, 0.4); font-size: 12px; font-weight: normal; text-transform: uppercase;">Item</th>
            <th style="text-align: right; padding-bottom: 8px; color: rgba(248, 244, 238, 0.4); font-size: 12px; font-weight: normal; text-transform: uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 15px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: rgba(248, 244, 238, 0.7); margin-bottom: 5px;">
          <span>Subtotal:</span>
          <span style="text-align: right; float: right; font-weight: bold;">₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: rgba(248, 244, 238, 0.7); margin-bottom: 10px; clear: both;">
          <span>Shipping:</span>
          <span style="text-align: right; float: right; font-weight: bold;">${shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
        </div>
        <div style="border-top: 1px dashed #222; padding-top: 10px; margin-top: 10px; font-size: 15px; color: #F8F4EE; clear: both; overflow: auto;">
          <span>Total COD Collect Amount:</span>
          <span style="float: right; font-weight: bold; color: #D98E32;">₹${total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="border-top: 1px solid #222; margin-top: 30px; padding-top: 15px; font-size: 11px; color: rgba(248, 244, 238, 0.3); text-align: center;">
        Veloura Handcrafted Luxury Candles Notification System.
      </div>
    </div>
  `;

  try {
    // Send email to Customer
    const sendToCustomerPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Veloura Candles <onboarding@resend.dev>',
        to: customer.email,
        subject: `Your Veloura Order Confirmation - ${orderNumber}`,
        html: customerHtml,
      }),
    });

    // Send email to Seller
    const sendToSellerPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Veloura Orders <onboarding@resend.dev>',
        to: sellerEmail,
        subject: `[New COD Order] ${orderNumber} - ₹${total.toLocaleString('en-IN')}`,
        html: sellerHtml,
      }),
    });

    // Wait for both emails to send
    const [custRes, sellRes] = await Promise.all([sendToCustomerPromise, sendToSellerPromise]);

    if (!custRes.ok) {
      const errorData = await custRes.json();
      console.error('Customer email failed:', errorData);
    }
    if (!sellRes.ok) {
      const errorData = await sellRes.json();
      console.error('Seller email failed:', errorData);
    }

    if (!custRes.ok || !sellRes.ok) {
      // Return 200 with warning if at least one went through, or fail if both failed
      if (!custRes.ok && !sellRes.ok) {
        return res.status(500).json({ error: 'Failed to send automated emails.' });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
