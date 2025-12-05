#troll file 

{
  description = "Esports Betting Application - NestJS Backend + Next.js Frontend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        # Node.js version - using 20 LTS for compatibility
        nodejs = pkgs.nodejs_20;

        # PostgreSQL version matching docker-compose
        postgresql = pkgs.postgresql_15;

        # Common build inputs for the project
        commonBuildInputs = with pkgs; [
          nodejs
          nodePackages.npm
          nodePackages.typescript
          nodePackages.typescript-language-server

          # Database
          postgresql

          # Development tools
          git
          jq
          curl
          docker
          docker-compose

          # For native Node.js modules (bcrypt, sqlite3)
          python3
          gnumake
          gcc
          pkg-config
          openssl
        ];

        # Shell hook for development
        shellHook = ''
          echo "🎮 Esports Betting Application Development Environment"
          echo ""
          echo "Available commands:"
          echo "  backend:dev    - Start backend in development mode"
          echo "  frontend:dev   - Start frontend in development mode"
          echo "  db:start       - Start PostgreSQL database"
          echo "  db:stop        - Stop PostgreSQL database"
          echo "  install        - Install all dependencies"
          echo ""

          # Set up environment variables
          export PGDATA="$PWD/.postgres/data"
          export PGHOST="$PWD/.postgres"
          export PGPORT="5432"
          export DATABASE_HOST="localhost"
          export DATABASE_PORT="5432"
          export DATABASE_USER="postgres"
          export DATABASE_PASSWORD="postgres"
          export DATABASE_NAME="esports_betting"
          export DB_HOST="localhost"
          export DB_PORT="5432"
          export DB_USER="postgres"
          export DB_PASSWORD="postgres"
          export DB_NAME="esports_betting"

          # Helper functions
          backend:dev() {
            cd backend && npm run start:dev
          }

          frontend:dev() {
            cd frontend && npm run dev
          }

          db:start() {
            if [ ! -d "$PGDATA" ]; then
              echo "Initializing PostgreSQL database..."
              mkdir -p "$PWD/.postgres"
              initdb -D "$PGDATA" --auth=trust --no-locale --encoding=UTF8
            fi
            if ! pg_isready -q; then
              echo "Starting PostgreSQL..."
              pg_ctl -D "$PGDATA" -l "$PWD/.postgres/postgres.log" -o "-k $PGHOST -p $PGPORT" start
              sleep 2
              # Create database if it doesn't exist
              createdb -h "$PGHOST" -p "$PGPORT" "$DATABASE_NAME" 2>/dev/null || true
            else
              echo "PostgreSQL is already running"
            fi
          }

          db:stop() {
            if pg_isready -q; then
              echo "Stopping PostgreSQL..."
              pg_ctl -D "$PGDATA" stop
            else
              echo "PostgreSQL is not running"
            fi
          }

          install() {
            echo "Installing backend dependencies..."
            (cd backend && npm install)
            echo "Installing frontend dependencies..."
            (cd frontend && npm install)
            echo "Done!"
          }

          export -f backend:dev
          export -f frontend:dev
          export -f db:start
          export -f db:stop
          export -f install
        '';

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = commonBuildInputs;
          inherit shellHook;

          # Environment variables for native module compilation
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.openssl
            pkgs.stdenv.cc.cc.lib
          ];
        };

        # Alternative shell with just Node.js (lighter weight)
        devShells.minimal = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            nodePackages.npm
          ];

          shellHook = ''
            echo "🎮 Minimal Development Environment (Node.js only)"
          '';
        };

        # Packages (for building the applications)
        packages = {
          # Backend package
          backend = pkgs.buildNpmPackage {
            pname = "esports-betting-backend";
            version = "0.0.1";
            src = ./backend;

            npmDepsHash = ""; # Run: nix build .#backend 2>&1 | grep "got:" to get hash
            
            nativeBuildInputs = with pkgs; [
              python3
              gnumake
              gcc
              pkg-config
            ];

            buildPhase = ''
              npm run build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r dist $out/
              cp -r node_modules $out/
              cp package.json $out/
            '';
          };

          # Frontend package
          frontend = pkgs.buildNpmPackage {
            pname = "esports-betting-frontend";
            version = "0.1.0";
            src = ./frontend;

            npmDepsHash = ""; # Run: nix build .#frontend 2>&1 | grep "got:" to get hash

            buildPhase = ''
              npm run build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r .next $out/
              cp -r public $out/ 2>/dev/null || true
              cp -r node_modules $out/
              cp package.json $out/
            '';
          };
        };

        # Docker image builds (alternative to Dockerfiles)
        packages.docker-backend = pkgs.dockerTools.buildImage {
          name = "esports-betting-backend";
          tag = "latest";

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ self.packages.${system}.backend nodejs ];
            pathsToLink = [ "/bin" ];
          };

          config = {
            Cmd = [ "node" "dist/main.js" ];
            ExposedPorts = {
              "5000/tcp" = {};
            };
            Env = [
              "NODE_ENV=production"
              "PORT=5000"
            ];
          };
        };

        packages.docker-frontend = pkgs.dockerTools.buildImage {
          name = "esports-betting-frontend";
          tag = "latest";

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ self.packages.${system}.frontend nodejs ];
            pathsToLink = [ "/bin" ];
          };

          config = {
            Cmd = [ "npm" "start" ];
            ExposedPorts = {
              "3000/tcp" = {};
            };
            Env = [
              "NODE_ENV=production"
            ];
          };
        };

        # Default package
        packages.default = self.packages.${system}.backend;
      }
    );
}
