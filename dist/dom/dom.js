"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomRelationshipType = exports.DomType = void 0;
var DomType;
(function (DomType) {
    DomType["Document"] = "document";
})(DomType = exports.DomType || (exports.DomType = {}));
var DomRelationshipType;
(function (DomRelationshipType) {
    DomRelationshipType[DomRelationshipType["Settings"] = 0] = "Settings";
    DomRelationshipType[DomRelationshipType["Theme"] = 1] = "Theme";
    DomRelationshipType[DomRelationshipType["StylesWithEffects"] = 2] = "StylesWithEffects";
    DomRelationshipType[DomRelationshipType["Styles"] = 3] = "Styles";
    DomRelationshipType[DomRelationshipType["FontTable"] = 4] = "FontTable";
    DomRelationshipType[DomRelationshipType["Image"] = 5] = "Image";
    DomRelationshipType[DomRelationshipType["WebSettings"] = 6] = "WebSettings";
    DomRelationshipType[DomRelationshipType["Unknown"] = 7] = "Unknown";
})(DomRelationshipType = exports.DomRelationshipType || (exports.DomRelationshipType = {}));
