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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddlewareFactory = exports.LoggerMiddleware = void 0;
const on_finished_1 = __importDefault(require("on-finished"));
const typedi_1 = require("typedi");
const uuidv4_1 = require("uuidv4");
const axios_1 = __importDefault(require("axios"));
const loggerService_1 = require("../services/loggerService");
let LoggerMiddleware = /** @class */ (() => {
    let LoggerMiddleware = class LoggerMiddleware {
        constructor(loggerService) {
            this.loggerService = loggerService;
        }
        getPayload(req) {
            const { body } = req;
            const { method } = req;
            return {
                timestamp: new Date().getTime(),
                userId: Number(req.get("user-id")),
                httpMethod: method,
                httpUrl: req.path,
                requestBody: JSON.stringify(body),
                statusCode: 102,
                requestId: uuidv4_1.uuid(),
            };
        }
        registrarLog(req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const { method } = req;
                if (method !== "GET") {
                    const log = this.getPayload(req);
                    try {
                        yield this.loggerService.info(log);
                        on_finished_1.default(res, (err, response) => {
                            log.statusCode = response.statusCode;
                            log.timestamp = new Date().getTime();
                            this.loggerService.info(log);
                        });
                    }
                    catch (error) {
                        res.status(504).json({ error: { message: error.message, name: error.name, code: error.code } });
                    }
                }
                next();
            });
        }
    };
    LoggerMiddleware = __decorate([
        typedi_1.Service("loggerMiddleware"),
        __metadata("design:paramtypes", [loggerService_1.LoggerService])
    ], LoggerMiddleware);
    return LoggerMiddleware;
})();
exports.LoggerMiddleware = LoggerMiddleware;
let LoggerMiddlewareFactory = /** @class */ (() => {
    class LoggerMiddlewareFactory {
        static create(baseUrl) {
            const loggerApi = axios_1.default.create({
                baseURL: baseUrl,
            });
            const loggerService = new loggerService_1.LoggerService(loggerApi);
            return new LoggerMiddleware(loggerService);
        }
        static createWithAPI(loggerApi) {
            // eslint-disable-next-line no-underscore-dangle
            const _loggerApi = loggerApi;
            const loggerService = new loggerService_1.LoggerService(_loggerApi);
            return new LoggerMiddleware(loggerService);
        }
    }
    __decorate([
        __param(0, typedi_1.Inject("loggerAPI")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", LoggerMiddleware)
    ], LoggerMiddlewareFactory, "createWithAPI", null);
    return LoggerMiddlewareFactory;
})();
exports.LoggerMiddlewareFactory = LoggerMiddlewareFactory;
//# sourceMappingURL=loggerMiddleware.js.map