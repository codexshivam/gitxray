export interface SampleRepo {
  owner: string;
  repo: string;
  name: string;
  language: string;
  description: string;
  files: Record<string, string>;
}

export const SAMPLE_REPOSITORIES: Record<string, SampleRepo> = {
  'pallets/flask': {
    owner: 'pallets',
    repo: 'flask',
    name: 'Flask',
    language: 'Python',
    description: 'The Python micro framework for building web applications',
    files: {
      'src/app.py': `from .routes import router
from .models import User, db
from .config import Config

class FlaskApp:
    def __init__(self, name):
        self.name = name
        self.config = Config()
        self.router = router
        self.db = db

    def run(self, host='0.0.0.0', port=5000):
        print(f"Starting {self.name} on {host}:{port}")
`,
      'src/routes.py': `from .models import User
from .config import Config

def router(path, method='GET'):
    if path == '/users':
        return [User('Alice'), User('Bob')]
    return {'status': 200, 'message': 'OK'}
`,
      'src/models.py': `from .config import Config

class Database:
    def __init__(self):
        self.connected = True

db = Database()

class User:
    def __init__(self, username):
        self.username = username
        self.role = Config.DEFAULT_ROLE
`,
      'src/config.py': `class Config:
    DEBUG = True
    DEFAULT_ROLE = 'user'
    SECRET_KEY = 'super-secret'
`,
      'src/utils.py': `def format_response(data):
    return {'data': data, 'version': '1.0'}
`,
      'tests/test_app.py': `from src.app import FlaskApp
from src.routes import router

def test_app():
    app = FlaskApp('test')
    assert app.name == 'test'
`
    }
  },

  'expressjs/express': {
    owner: 'expressjs',
    repo: 'express',
    name: 'Express',
    language: 'JavaScript',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
    files: {
      'lib/express.js': `const router = require('./router');
const application = require('./application');
const request = require('./request');
const response = require('./response');

function createApplication() {
  const app = function(req, res, next) {
    app.handle(req, res, next);
  };
  return Object.assign(app, application);
}

module.exports = createApplication;
`,
      'lib/application.js': `const router = require('./router');
const middleware = require('./middleware');

module.exports = {
  handle: function(req, res) {
    router.dispatch(req, res);
  },
  use: function(fn) {
    middleware.push(fn);
  }
};
`,
      'lib/router.js': `const layer = require('./layer');
const route = require('./route');

module.exports = {
  dispatch: function(req, res) {
    console.log("Dispatching route", req.url);
  }
};
`,
      'lib/middleware.js': `const utils = require('./utils');

module.exports = {
  stack: [],
  push: function(fn) {
    this.stack.push(fn);
  }
};
`,
      'lib/layer.js': `const utils = require('./utils');

function Layer(path, fn) {
  this.path = path;
  this.fn = fn;
}

module.exports = Layer;
`,
      'lib/route.js': `const layer = require('./layer');

function Route(path) {
  this.path = path;
  this.stack = [];
}

module.exports = Route;
`,
      'lib/utils.js': `module.exports = {
  normalizeType: function(type) {
    return type.toLowerCase();
  }
};
`
    }
  },

  'openai/whisper': {
    owner: 'openai',
    repo: 'whisper',
    name: 'Whisper',
    language: 'Python',
    description: 'Robust Speech Recognition via Large-Scale Weak Supervision',
    files: {
      'whisper/model.py': `from .audio import log_mel_spectrogram
from .decoding import decode
import torch

class Whisper:
    def __init__(self, dims):
        self.dims = dims

    def transcribe(self, audio_path):
        mel = log_mel_spectrogram(audio_path)
        return decode(self, mel)
`,
      'whisper/audio.py': `import math

def log_mel_spectrogram(audio):
    # Converts waveform into 80-channel log Mel-frequency spectrogram
    return [[0.1 * i for i in range(80)]]
`,
      'whisper/decoding.py': `from .tokenizer import get_tokenizer

def decode(model, mel):
    tokenizer = get_tokenizer()
    return {'text': 'Recognized transcript sequence', 'tokens': [1, 2, 3]}
`,
      'whisper/tokenizer.py': `def get_tokenizer(multilingual=True):
    return {'vocab_size': 51865, 'language': 'en'}
`
    }
  },

  'codexshivam/nidaniq': {
    owner: 'codexshivam',
    repo: 'nidaniq',
    name: 'NidanIQ',
    language: 'Python',
    description: 'Vector-borne disease surveillance and geospatial outbreak prediction',
    files: {
      'backend/app/main.py': `from .api.v1 import router
from .core.config import settings
from .db.session import engine

def create_app():
    print(f"Initializing NidanIQ under {settings.PROJECT_NAME}")
    return {"router": router, "engine": engine}
`,
      'backend/app/api/v1/__init__.py': `from .auth import auth_router
from .surveillance import surveillance_router

class APIRouter:
    def __init__(self):
        self.auth = auth_router
        self.surveillance = surveillance_router

router = APIRouter()
`,
      'backend/app/api/v1/auth.py': `from ...core.security import verify_password
from ...db.models import User

class AuthRouter:
    def login(self, username, password):
        return {"token": "jwt-token-xyz"}

auth_router = AuthRouter()
`,
      'backend/app/api/v1/surveillance.py': `from ...db.models import OutbreakEvent
from ...core.config import settings

class SurveillanceRouter:
    def get_active_cases(self, region_id):
        return [OutbreakEvent(region_id, 42)]

surveillance_router = SurveillanceRouter()
`,
      'backend/app/core/config.py': `class Settings:
    PROJECT_NAME = "NidanIQ"
    API_V1_STR = "/api/v1"
    DATABASE_URL = "postgresql://localhost:5432/nidaniq"

settings = Settings()
`,
      'backend/app/core/security.py': `def verify_password(plain, hashed):
    return True

def create_access_token(data):
    return "token"
`,
      'backend/app/db/session.py': `from ..core.config import settings

class Engine:
    def __init__(self, url):
        self.url = url

engine = Engine(settings.DATABASE_URL)
`,
      'backend/app/db/models.py': `class User:
    def __init__(self, username):
        self.username = username

class OutbreakEvent:
    def __init__(self, region, count):
        self.region = region
        self.count = count
`
    }
  }
};
