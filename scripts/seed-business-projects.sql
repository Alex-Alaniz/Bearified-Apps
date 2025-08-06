-- Seed Business Projects for Bearified Apps
-- This adds real projects for SoleBrew and Chimpanion development

-- SoleBrew Coffee Management System Projects
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, progress_percentage, color, icon) VALUES
(
  'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
  'SoleBrew MVP - Core Coffee Shop Management',
  'Build the minimum viable product for coffee shop owners to manage inventory, sales, and customer data. Focus on essential features that solve immediate pain points.',
  'active',
  'high',
  '2024-01-15',
  '2024-04-15',
  35,
  '#F59E0B',
  'coffee'
),
(
  'b2c3d4e5-f6a7-4890-b1c2-d3e4f5a6b7c8',
  'SoleBrew Analytics Dashboard',
  'Develop comprehensive analytics and reporting dashboard for coffee shop owners to track sales trends, inventory levels, and customer insights.',
  'planning',
  'medium',
  '2024-03-01',
  '2024-06-30',
  0,
  '#F59E0B',
  'chart-bar'
),
(
  'c3d4e5f6-a7b8-4901-c2d3-e4f5a6b7c8d9',
  'SoleBrew Multi-Location Support',
  'Extend the platform to support franchise operations and multiple coffee shop locations with centralized management.',
  'planning',
  'medium',
  '2024-06-01',
  '2024-10-31',
  0,
  '#F59E0B',
  'building-store'
);

-- Chimpanion Security & Intelligence Platform Projects  
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, progress_percentage, color, icon) VALUES
(
  'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
  'Chimpanion Core Security Platform',
  'Develop the foundational security monitoring and threat detection platform with real-time analysis capabilities.',
  'active',
  'critical',
  '2024-01-01',
  '2024-05-31',
  60,
  '#10B981',
  'shield'
),
(
  'e5f6a7b8-c9d0-4123-e4f5-a6b7c8d9e0f1',
  'Chimpanion Business Intelligence Integration',
  'Build comprehensive business intelligence tools that integrate security data with business metrics for actionable insights.',
  'planning',
  'high',
  '2024-04-01',
  '2024-08-15',
  0,
  '#10B981',
  'analytics'
),
(
  'f6a7b8c9-d0e1-4234-f5a6-b7c8d9e0f1a2',
  'Chimpanion Mobile App',
  'Develop mobile application for security monitoring and alerts with push notifications and real-time dashboards.',
  'planning',
  'medium',
  '2024-05-15',
  '2024-09-30',
  0,
  '#10B981',
  'smartphone'
);

-- Bearified Apps Platform Projects
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, progress_percentage, color, icon) VALUES
(
  'a7b8c9d0-e1f2-4345-a6b7-c8d9e0f1a2b3',
  'Unified Authentication System',
  'Complete the Privy-based authentication system with role-based access control and multi-app support.',
  'active',
  'critical',
  '2024-01-01',
  '2024-02-29',
  95,
  '#6366F1',
  'key'
),
(
  'b8c9d0e1-f2a3-4456-b7c8-d9e0f1a2b3c4',
  'Admin Panel Enhancement',
  'Enhance the admin panel with user management, app configuration, and system monitoring capabilities.',
  'active',
  'high',
  '2024-02-01',
  '2024-03-31',
  25,
  '#6366F1',
  'settings'
),
(
  'c9d0e1f2-a3b4-4567-c8d9-e0f1a2b3c4d5',
  'Project Management System',
  'Build comprehensive project management tools with Kanban boards, task tracking, and team collaboration.',
  'active',
  'high',
  '2024-01-15',
  '2024-04-30',
  70,
  '#6366F1',
  'kanban-square'
);

-- Sample tasks for the active projects
INSERT INTO tasks (id, title, description, status, priority, project_id, column_id, position, created_at, updated_at) VALUES
-- SoleBrew MVP Tasks
(
  'task-001',
  'Design inventory management UI',
  'Create user interface designs for inventory tracking, stock alerts, and supplier management.',
  'done',
  'high',
  'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
  'done',
  1,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '10 days'
),
(
  'task-002',
  'Implement sales tracking backend',
  'Build API endpoints for recording sales transactions and generating daily/weekly reports.',
  'in_progress',
  'high',
  'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
  'in_progress',
  1,
  NOW() - INTERVAL '8 days',
  NOW()
),
(
  'task-003',
  'Customer loyalty program',
  'Design and implement customer rewards system with points and tier-based benefits.',
  'todo',
  'medium',
  'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
  'todo',
  1,
  NOW() - INTERVAL '5 days',
  NOW()
),

-- Chimpanion Security Platform Tasks
(
  'task-004',
  'Real-time threat detection engine',
  'Implement machine learning algorithms for identifying security threats in real-time data streams.',
  'in_progress',
  'critical',
  'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
  'in_progress',
  1,
  NOW() - INTERVAL '12 days',
  NOW()
),
(
  'task-005',
  'Security dashboard UI',
  'Build comprehensive security monitoring dashboard with customizable widgets and alerts.',
  'done',
  'high',
  'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
  'done',
  1,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '7 days'
),

-- Platform Enhancement Tasks
(
  'task-006',
  'Role-based access control',
  'Implement granular permissions system with role inheritance and app-specific access.',
  'done',
  'critical',
  'a7b8c9d0-e1f2-4345-a6b7-c8d9e0f1a2b3',
  'done',
  1,
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '2 days'
),
(
  'task-007',
  'User management interface',
  'Build admin interface for managing users, roles, and app permissions.',
  'in_progress',
  'high',
  'b8c9d0e1-f2a3-4456-b7c8-d9e0f1a2b3c4',
  'in_progress',
  1,
  NOW() - INTERVAL '10 days',
  NOW()
),
(
  'task-008',
  'Drag-and-drop Kanban board',
  'Implement interactive Kanban board with drag-and-drop task management using @dnd-kit.',
  'done',
  'high',
  'c9d0e1f2-a3b4-4567-c8d9-e0f1a2b3c4d5',
  'done',
  1,
  NOW() - INTERVAL '18 days',
  NOW() - INTERVAL '5 days'
);