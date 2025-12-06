<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->




<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Betis</h3>

  <p align="center">
    this project is a betting application to bet on esport matches
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    &middot;
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project is a betting esport application made for Andy Ciqnuin's class

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Next][Next.js]][Next-url]
* [![Nest.js][Nest.js]][Nest-url]

#### Stack explanation 
I chose NestJS because it enables rapid development; its performant TypeORM helps me implement features faster, and its strict structure helps me organize the backend. For the backend architecture, I chose a domain-driven (métier) approach.
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run the entire application is with Docker Compose:

```sh
# Clone the repository
git clone https://github.com/WessimH/jihadprojet.git
cd jihadprojet

# Start all services (database, backend, frontend)
docker compose up

# Or build fresh images
docker compose up --build
```

That's it! The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

To stop the application:
```sh
docker compose down

# To also remove the database volume:
docker compose down -v
```

### Environment Variables

Copy `.env.example` to `.env` and customize if needed:

```sh
cp .env.example .env
```

Key variables:
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USER` | postgres | Database username |
| `DB_PASSWORD` | postgres123 | Database password |
| `DB_NAME` | esports_betting | Database name |
| `JWT_SECRET` | (change me) | Secret for JWT tokens |
| `NEXT_PUBLIC_API_URL` | http://localhost:5000 | API URL for frontend |

### Default Accounts

The application automatically seeds default accounts on first startup:

| Role | Username | Email | Password | Balance |
|------|----------|-------|----------|---------|
| **Admin** | `admin` | admin@esportsbetting.com | `Admin123` | $10,000 |
| **User** | `user` | user@esportsbetting.com | `User123` | $1,000 |

The seeder also creates sample games (CS:GO, League of Legends, Dota 2, Valorant) and teams.

### Prerequisites (Manual Setup)

If you prefer to run without Docker:

To run this app you need Node.js and a few other tools. This is an example of how to list things you need to use the software and how to install them.

- Node.js (LTS) — recommended v18+
  ```sh
  # using nvm (recommended)
  nvm install --lts
  nvm use --lts
  node -v
  ```

- npm (bundled with Node) — update to latest if needed
  ```sh
  npm install -g npm@latest
  ```

- Optional package managers
  ```sh
  # pnpm (optional)
  npm install -g pnpm

  # yarn (optional)
  npm install -g yarn
  ```

- Database — PostgreSQL (recommended)  
  You can install locally or run with Docker:
  ```sh
  docker run --name betis-db -e POSTGRES_PASSWORD=betis -e POSTGRES_USER=betis -e POSTGRES_DB=betis -p 5432:5432 -d postgres:13
  ```

- (Optional) Redis — if you use caching or jobs
  ```sh
  docker run --name betis-redis -p 6379:6379 -d redis:6
  ```

- Git — for cloning and contribution
  ```sh
  # example
  git --version
  ```

- Environment variables / secrets  
  Create a .env (or the config file your app expects) with at least:
  ```
  DATABASE_URL=postgres://betis:betis@localhost:5432/betis
  PORT=3000
  JWT_SECRET=your_jwt_secret
  API_KEY=your_external_api_key
  ```

Notes:
- The backend uses NestJS with TypeORM; ensure the DB is reachable before starting the server.
- Replace placeholder secrets and API keys with secure values.
- Follow the Installation section in the README after installing these prerequisites.

### Installation (Manual Setup)

1. Clone the repo
   ```sh
   git clone https://github.com/WessimH/jihadprojet.git
   cd jihadprojet
   ```

2. Start PostgreSQL database
   ```sh
   docker run --name esports-db -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_USER=postgres -e POSTGRES_DB=esports_betting -p 5432:5432 -d postgres:15-alpine
   ```

3. Install and run Backend
   ```sh
   cd backend
   npm install
   
   # Create .env file
   echo "DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres123
   DB_NAME=esports_betting
   JWT_SECRET=your-secret-key
   PORT=5000" > .env
   
   npm run start:dev
   ```

4. Install and run Frontend (in another terminal)
   ```sh
   cd frontend
   npm install
   
   # Create .env file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   
   npm run dev
   ```

5. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Admin Account

After starting the application, you can login with:
- **Username**: admin
- **Password**: Admin123

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Login and get JWT token |
| `/auth/profile` | GET | Get current user profile |
| `/users` | GET/POST | List/create users |
| `/teams` | GET/POST | List/create teams |
| `/matches` | GET/POST | List/create matches |
| `/games` | GET/POST | List/create games |
| `/bets` | GET/POST | List/create bets |

### Testing the API

```sh
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'

# Get teams (with token)
curl http://localhost:5000/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Nest.js]: https://img.shields.io/badge/Nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[Nest-url]: https://nestjs.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 