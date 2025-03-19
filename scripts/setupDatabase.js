require('dotenv').config();
const supabaseAdmin = require('../server/config/supabaseAdmin');

// Function to create database tables
async function setupDatabase() {
  console.log('Setting up database tables...');
  
  try {
    // Create Users table using SQL through RPC
    console.log('Creating Users table...');
    const { error: usersError } = await supabaseAdmin.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS "Users" (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          device_token TEXT,
          notification_time TIME DEFAULT '18:00:00',
          timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
          preferred_categories TEXT[],
          last_prompt_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (usersError) {
      console.log('Note: Using alternative method to create Users table');
      // Check if table exists
      const { data: usersExists } = await supabaseAdmin
        .from('Users')
        .select('id')
        .limit(1);
      
      if (usersExists === null) {
        console.log('Users table needs to be created manually in the Supabase dashboard');
        console.log('Please create the following tables with these columns:');
        console.log(`
          Users table:
          - id: UUID (primary key, default: uuid_generate_v4())
          - email: TEXT (unique, not null)
          - device_token: TEXT
          - notification_time: TIME (default: '18:00:00')
          - timezone: TEXT (not null, default: 'America/Los_Angeles')
          - preferred_categories: TEXT[]
          - last_prompt_id: UUID
          - created_at: TIMESTAMP WITH TIME ZONE (default: NOW())
          - updated_at: TIMESTAMP WITH TIME ZONE (default: NOW())
        `);
      } else {
        console.log('Users table already exists');
      }
    } else {
      console.log('Users table created or already exists');
    }
    
    // Create Prompts table
    console.log('Creating Prompts table...');
    const { error: promptsError } = await supabaseAdmin.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS "Prompts" (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          difficulty INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (promptsError) {
      console.log('Note: Using alternative method to check Prompts table');
      // Check if table exists
      const { data: promptsExists } = await supabaseAdmin
        .from('Prompts')
        .select('id')
        .limit(1);
      
      if (promptsExists === null) {
        console.log('Prompts table needs to be created manually in the Supabase dashboard');
        console.log(`
          Prompts table:
          - id: UUID (primary key, default: uuid_generate_v4())
          - content: TEXT (not null)
          - category: TEXT (not null)
          - difficulty: INTEGER (default: 1)
          - created_at: TIMESTAMP WITH TIME ZONE (default: NOW())
          - updated_at: TIMESTAMP WITH TIME ZONE (default: NOW())
        `);
      } else {
        console.log('Prompts table already exists');
      }
    } else {
      console.log('Prompts table created or already exists');
    }
    
    // Create PromptHistory table
    console.log('Creating PromptHistory table...');
    const { error: historyError } = await supabaseAdmin.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS "PromptHistory" (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES "Users"(id) ON DELETE CASCADE,
          prompt_id UUID REFERENCES "Prompts"(id) ON DELETE CASCADE,
          user_response TEXT,
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          responded_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (historyError) {
      console.log('Note: Using alternative method to check PromptHistory table');
      // Check if table exists
      const { data: historyExists } = await supabaseAdmin
        .from('PromptHistory')
        .select('id')
        .limit(1);
      
      if (historyExists === null) {
        console.log('PromptHistory table needs to be created manually in the Supabase dashboard');
        console.log(`
          PromptHistory table:
          - id: UUID (primary key, default: uuid_generate_v4())
          - user_id: UUID (references Users.id, on delete cascade)
          - prompt_id: UUID (references Prompts.id, on delete cascade)
          - user_response: TEXT
          - sent_at: TIMESTAMP WITH TIME ZONE (default: NOW())
          - responded_at: TIMESTAMP WITH TIME ZONE
          - created_at: TIMESTAMP WITH TIME ZONE (default: NOW())
          - updated_at: TIMESTAMP WITH TIME ZONE (default: NOW())
        `);
      } else {
        console.log('PromptHistory table already exists');
      }
    } else {
      console.log('PromptHistory table created or already exists');
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Run the setup function
setupDatabase()
  .then(() => {
    console.log('Setup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
