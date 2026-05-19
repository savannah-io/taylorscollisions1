import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '../../../lib/database.types';

const FALLBACK = {
  reviews: [],
  rating: 5.0,
  total_reviews: 0,
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient<Database>(supabaseUrl, supabaseKey)
    : null;

if (!supabase) {
  console.warn(
    '[api/reviews] Supabase env vars missing — route will return fallback data.'
  );
}

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '6');
    const start = (page - 1) * pageSize;

    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting review count:', countError);
      return NextResponse.json(FALLBACK);
    }

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .order('time', { ascending: false })
      .range(start, start + pageSize - 1);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return NextResponse.json(FALLBACK);
    }

    const { data: ratingData, error: ratingError } = await supabase
      .from('reviews')
      .select('rating');

    if (ratingError) {
      console.error('Error getting ratings:', ratingError);
      return NextResponse.json({
        reviews: reviews || [],
        rating: 5.0,
        total_reviews: count || 0,
      });
    }

    const averageRating = ratingData?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
    const totalRating = ratingData?.length > 0 ? averageRating / ratingData.length : 0;

    return NextResponse.json({
      reviews: reviews || [],
      rating: parseFloat(totalRating.toFixed(1)),
      total_reviews: count || 0,
    });

  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(FALLBACK);
  }
}
