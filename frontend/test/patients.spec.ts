import { test, expect } from '@playwright/test';

test.describe('Patients Page', () => {
  test('should display patient table headers', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('table')).toBeVisible();
    
    await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date of Birth' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Phone' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Address' })).toBeVisible();
  });

  test('Patient Details', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('cell', { name: '3', exact: true }).click();

    await expect(page).toHaveURL('/3');
    
    await expect(page.getByText('ID: 3')).toBeVisible();
    await expect(page.getByText('Name: Bob Johnson')).toBeVisible();
    await expect(page.getByText('Date of Birth:')).toBeVisible();
    await expect(page.getByText('Email: bob.johnson@email.com')).toBeVisible();
    await expect(page.getByText('Address: 789 Pine Rd')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Annual Exam' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Lab Results' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Lab Results' })).toBeVisible();
  });
});