"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var on_finished_1 = __importDefault(require("on-finished"));
var typedi_1 = require("typedi");
var uuidv4_1 = require("uuidv4");
var axios_1 = __importDefault(require("axios"));
var loggerService_1 = require("../services/loggerService");
var LoggerMiddleware = /** @class */ (function () {
    function LoggerMiddleware(loggerService) {
        this.loggerService = loggerService;
    }
    LoggerMiddleware.prototype.getPayload = function (req) {
        var body = req.body;
        var method = req.method;
        return {
            timestamp: new Date().getTime(),
            userId: Number(req.get("user-id")),
            httpMethod: method,
            httpUrl: req.path,
            requestBody: JSON.stringify(body),
            statusCode: 102,
            requestId: uuidv4_1.uuid(),
        };
    };
    LoggerMiddleware.prototype.registrarLog = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var method, log_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = req.method;
                        console.log(this.getPayload(req));
                        if (!(method !== "GET")) return [3 /*break*/, 4];
                        log_1 = this.getPayload(req);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.loggerService.info(log_1)];
                    case 2:
                        _a.sent();
                        on_finished_1.default(res, function (err, response) {
                            log_1.statusCode = response.statusCode;
                            log_1.timestamp = new Date().getTime();
                            _this.loggerService.info(log_1);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(504).json({ error: { message: error_1.message, name: error_1.name, code: error_1.code } })];
                    case 4:
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoggerMiddleware = __decorate([
        typedi_1.Service("loggerMiddleware"),
        __param(0, typedi_1.Inject("loggerService")),
        __metadata("design:paramtypes", [loggerService_1.LoggerService])
    ], LoggerMiddleware);
    return LoggerMiddleware;
}());
exports.LoggerMiddleware = LoggerMiddleware;
var LoggerMiddlewareFactory = /** @class */ (function () {
    function LoggerMiddlewareFactory() {
    }
    LoggerMiddlewareFactory.create = function (baseUrl) {
        var loggerApi = axios_1.default.create({
            baseURL: baseUrl,
        });
        var loggerService = new loggerService_1.LoggerService(loggerApi);
        return new LoggerMiddleware(loggerService);
    };
    LoggerMiddlewareFactory.createWithAPI = function (loggerApi) {
        var _loggerApi = loggerApi;
        var loggerService = new loggerService_1.LoggerService(_loggerApi);
        return new LoggerMiddleware(loggerService);
    };
    __decorate([
        __param(0, typedi_1.Inject("loggerAPI")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", LoggerMiddleware)
    ], LoggerMiddlewareFactory, "createWithAPI", null);
    LoggerMiddlewareFactory = __decorate([
        typedi_1.Service()
    ], LoggerMiddlewareFactory);
    return LoggerMiddlewareFactory;
}());
exports.LoggerMiddlewareFactory = LoggerMiddlewareFactory;
//# sourceMappingURL=loggerMiddleware.js.map