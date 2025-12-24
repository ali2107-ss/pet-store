import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment methods:', error);
      return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, card_number, expiry_month, expiry_year, card_brand, is_default } = body;

    if (!card_number || !expiry_month || !expiry_year) {
      return NextResponse.json({ error: 'Card number, expiry month and year are required' }, { status: 400 });
    }

    // Mask card number (keep last 4 digits)
    const card_number_masked = `****${card_number.slice(-4)}`;

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('user_payment_methods')
      .insert({
        user_id: user.id,
        type: type || 'card',
        card_number_masked,
        card_brand: card_brand || 'Unknown',
        expiry_month,
        expiry_year,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment method:', error);
      return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, card_number, expiry_month, expiry_year, card_brand, is_default } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (type) updateData.type = type;
    if (card_number) updateData.card_number_masked = `****${card_number.slice(-4)}`;
    if (expiry_month) updateData.expiry_month = expiry_month;
    if (expiry_year) updateData.expiry_year = expiry_year;
    if (card_brand) updateData.card_brand = card_brand;

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
      updateData.is_default = true;
    }

    const { data, error } = await supabase
      .from('user_payment_methods')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment method:', error);
      return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting payment method:', error);
      return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}