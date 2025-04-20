export const expenseCategories = [
  'Food & Dining',
  'Shopping',
  'Housing',
  'Transportation',
  'Health & Medical',
  'Education',
  'Travel',
  'Entertainment',
  'Gifts & Donations',
  'Bills & Utilities',
  'Other'
];

export const categoryColors = {
  'Food & Dining': '#F97316', // Orange
  'Shopping': '#8B5CF6', // Purple
  'Housing': '#10B981', // Emerald
  'Transportation': '#3B82F6', // Blue
  'Health & Medical': '#EF4444', // Red
  'Education': '#14B8A6', // Teal
  'Travel': '#06B6D4', // Cyan
  'Entertainment': '#EC4899', // Pink
  'Gifts & Donations': '#F59E0B', // Amber
  'Bills & Utilities': '#6366F1', // Indigo
  'Other': '#71717A' // Gray
};

export const getCategoryColor = (category) => {
  return categoryColors[category] || categoryColors['Other'];
}; 