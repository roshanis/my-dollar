import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const monthlyExpenses = await prisma.transaction.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true
      },
      where: {
        type: 'EXPENSE'
      }
    });

    // Format the data to include month names
    const formattedExpenses = monthlyExpenses.map(expense => ({
      month: new Date(expense.createdAt).toLocaleString('default', { month: 'short' }),
      _sum: {
        amount: expense._sum.amount
      }
    }));

    // Sort by date
    formattedExpenses.sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    return Response.json(formattedExpenses);
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    return Response.json({ error: 'Failed to fetch monthly expenses' }, { status: 500 });
  }
} 
} 