﻿//-----------------------------------------------------------------------
// <copyright file="cxa.common.productprice.js" company="Sitecore Corporation">
// Copyright (c) Sitecore Corporation 1999-2017
// </copyright>
// <summary>Provides a common tool</summary>
//-----------------------------------------------------------------------
// Copyright 2017 Sitecore Corporation A/S
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file 
// except in compliance with the License. You may obtain a copy of the License at
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the 
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
// either express or implied. See the License for the specific language governing permissions 
// and limitations under the License.
// -------------------------------------------------------------------------------------------

(function (root, factory) {
    'use strict';
    var instance;

    if (typeof define === 'function' && define.amd) {
        // use AMD define funtion to support AMD modules if in use
        define('CXA/Common/CartContext', ['exports'], factory);

    } else if (typeof exports === 'object') {
        // to support CommonJS
        factory(exports);
    }

    function createContext() {
        var context = {
            Handlers: {}, //repsoitory to store handlers
            LastHandlerId: -1 //last used handler Id, initialized to -1
        };
        return context;
    }

    function getContext() {
        if (!instance) {
            instance = createContext();
        }
        return instance;
    }
    // browser global variable
    var CartContext = getContext();
    root.CartContext = CartContext;

    factory(CartContext);

}(this, function (CartContext) {
    'use strict';
    function hasHandlers(eventtype) {
        var handlers = CartContext.Handlers[eventtype];
        var handlerId;
        for (handlerId in handlers) {
            if (handlers.hasOwnProperty(handlerId)) {
                return true;
            }
        }
    }

    function notifyHandler(handler, data) {
        handler(data);
    }

    function dispatch(eventtype, data) {
        var handlers = CartContext.Handlers[eventtype];

        var handlerId;
        for (handlerId in handlers) {
            if (handlers.hasOwnProperty(handlerId)) {
                notifyHandler(handlers[handlerId], data);
            }
        }
    }

    CartContext.Cache = {};
    CartContext.createCache = function (cartRequestFunction) {

        return function (callback) {
            if (!CartContext.Cache['key']) {
                CartContext.Cache['key'] = $.Deferred(function (defer) {
                    cartRequestFunction(defer, 'key');
                }).promise();
            }
            return CartContext.Cache['key'].done(callback);
        };
    };
    //-------------------- Service Public Functions ---------------------------------------------------------------------

    CartContext.CartData = null;
    CartContext.CartEvents = {
        CartUpdate: "cartUpdate"
    };

    CartContext.TriggerCartUpdateEvent = function () {
        CartContext.Cache = {};
        if (!hasHandlers(CartContext.CartEvents.CartUpdate)) {
            return false;
        }

        dispatch(CartContext.CartEvents.CartUpdate, null);
        return true;
    };

    CartContext.SubscribeHandler = function (eventtype, handler) {
        if (typeof handler !== 'function') {
            return false;
        }
        if (!CartContext.Handlers.hasOwnProperty(eventtype)) {
            CartContext.Handlers[eventtype] = {};
        }

        var newHandlerId = 'h_' + String(++CartContext.LastHandlerId);
        CartContext.Handlers[eventtype][newHandlerId] = handler;

        return newHandlerId;
    };

    CartContext.UnSubscribeHandler = function (handlerId) {
        if (CartContext.Handlers[handlerId]) {
            delete CartContext.Handlers[handlerId];
            return handlerId;
        }

        return null;
    };
}));;