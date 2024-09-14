"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = require("body-parser");
var express_1 = require("express");
var client_1 = require("@prisma/client");
var apiKey = 'zSJcAMrJvzGbtlKX8xgq7l8D_hAE5hTl-2A11Y6OMStwLI5gfxRp0POfZs324J60QHc2qeVN8c5Kmg5IHHdoyCuHd-x2HzU_nPvG8izFTCruzpvVHUT6FeiQR4q2XnYx';
var app = (0, express_1.default)();
var port = 3000; // default port to listen
var yelp = require('yelp-fusion');
var client = yelp.client(apiKey);
app.use(body_parser_1.default.json());
var prisma = new client_1.PrismaClient();
app.post('/api/stores', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, dataToAdd, store;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log(body);
                dataToAdd = {
                    storename: body === null || body === void 0 ? void 0 : body.storename,
                    location: body === null || body === void 0 ? void 0 : body.location,
                    coordinates: body === null || body === void 0 ? void 0 : body.coordinates,
                    date: new Date(Number(body === null || body === void 0 ? void 0 : body.date)),
                    amount: body.queue,
                    Item: {
                        create: body.items,
                    },
                };
                return [4 /*yield*/, prisma.store.create({ data: dataToAdd })];
            case 1:
                store = _a.sent();
                res.status(200).json(store);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/items', function (req, res) {
    prisma.item.findMany().then(function (results) {
        res.status(200).json({ results: results });
    });
});
app.get('/api/stores', function (req, res) {
    var _a = req.query, missing = _a.missing, date = _a.date, method = req.method;
    // const fulldate = new Date(Number(date));
    prisma.store.findMany({
        include: {
            StoresOnItems: true,
            Item: true
        },
        where: {
            // date: fulldate,
            Item: {
                some: { item: missing }
            }
        }
    }).then(function (results) {
        res.status(200).json({ results: results });
    });
});
app.put('/api/stores/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqid, storename, updatedStore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqid = req.params.id;
                storename = req.body.storename;
                console.log(reqid);
                console.log(storename);
                return [4 /*yield*/, prisma.store.update({
                        data: { storename: storename },
                        where: { id: Number(reqid) },
                    })];
            case 1:
                updatedStore = _a.sent();
                res.status(200).json({ updatedStore: updatedStore });
                return [2 /*return*/];
        }
    });
}); });
app.delete('/api/stores/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqid, deletedStore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqid = req.params.id;
                return [4 /*yield*/, prisma.store.delete({
                        where: { id: Number(reqid) },
                    })];
            case 1:
                deletedStore = _a.sent();
                res.status(200).json({ deletedStore: deletedStore });
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/points', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, missing, lat, log, method, searchRequest, stores;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, missing = _a.missing, lat = _a.lat, log = _a.log, method = req.method;
                searchRequest = {
                    term: missing,
                    //location: location
                };
                return [4 /*yield*/, client.search(searchRequest)];
            case 1:
                stores = _b.sent();
                res.status(200).json({ stores: stores });
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Example app listening on port ".concat(process.env.PORT, "!"));
});
