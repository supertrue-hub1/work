import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Basic validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save to database via Prisma
    // 2. Send email notification
    // 3. Send to CRM

    // For now, just log the submission
    console.log('New contact form submission:', {
      name,
      phone,
      email: email || 'N/A',
      message: message || 'N/A',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Заявка успешно отправлена' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке заявки' },
      { status: 500 }
    );
  }
}
