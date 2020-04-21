namespace :deploy do
  desc "Build static web site"
  task :build do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :npm, "run", "build" 
      end
    end
  end
end