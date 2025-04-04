import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

// Mock server setup
const server = setupServer(
  http.get('http://localhost:5000/api/collections', () => {
    return HttpResponse.json([
      { id: 1, name: 'School', color: 'bg-pink-500' },
      { id: 2, name: 'Personal', color: 'bg-teal-500' },
    ]);
  }),
  http.post('http://localhost:5000/api/tasks', async ({ request }) => {
    const task = (await request.json()) as { title: string; collectionId: number };
    return HttpResponse.json({
      id: 1,
      title: task?.title,
      collectionId: task?.collectionId,
    });
  }),
);

describe('TaskForm', () => {
  const mockOnClose = vi.fn();

  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

  // Reset handlers and mocks between tests
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  // Clean up after all tests
  afterAll(() => server.close());

  it('renders the form with basic fields', () => {
    render(
      <Provider store={store}>
        <TaskForm collectionId={1} onClose={mockOnClose} />
      </Provider>,
    );

    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('allows entering a task title', async () => {
    render(
      <Provider store={store}>
        <TaskForm collectionId={1} onClose={mockOnClose} />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Task title');
    await userEvent.type(input, 'New Task');
    expect(input).toHaveValue('New Task');
  });

  it('submits the form successfully', async () => {
    render(
      <Provider store={store}>
        <TaskForm collectionId={1} onClose={mockOnClose} />
      </Provider>,
    );

    await userEvent.type(screen.getByPlaceholderText('Task title'), 'Test Task');
    await userEvent.click(screen.getByText('Add Task'));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
