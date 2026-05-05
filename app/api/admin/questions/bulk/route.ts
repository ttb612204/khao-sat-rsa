import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const { questions, ids, action } = await request.json();

    if (action === 'delete') {
      if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ error: 'IDs are required for deletion' }, { status: 400 });
      }
      const { error } = await supabase
        .from('survey_questions')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    for (const q of questions) {
      const { error } = await supabase
        .from('survey_questions')
        .update({ 
          number: q.number, 
          order_index: q.order_index 
        })
        .eq('id', q.id);
      
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
