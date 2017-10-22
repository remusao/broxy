port module Broxy exposing (main)

-- WARNING: the TsElmInterfaces file is automatically generated at build-time
-- from declarations found in the file `src/ts-elm-interfaces.ts`. Each
-- `interface` declared in this file will generate an Elm type, a subscription,
-- a port and a decoder.

import TsElmInterfaces exposing (..)


-- Normal Elm imports

import Html exposing (program, Html, div, text, ul, li)
import Array exposing (..)


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { proxy : Maybe ISocksProxy
    , error : Maybe String
    , modules : Maybe ICliqzModules
    }


type Msg
    = TsElmInterface TypescriptMsg


init : ( Model, Cmd Msg )
init =
    ( { proxy = Nothing, error = Nothing, modules = Nothing }, Cmd.none )


proxyInfo : { proxy : Maybe ISocksProxy, error : Maybe String } -> Html Msg
proxyInfo { proxy, error } =
    case error of
        Just err ->
            text "Error while communicating from main to view"

        Nothing ->
            case proxy of
                Nothing ->
                    text "No proxy information available yet"

                Just { proxyPort, proxyHost } ->
                    div []
                        [ text "You can now connect to the socks proxy using:"
                        , text
                            (proxyHost ++ ":" ++ toString proxyPort)
                        ]


modulesInfo : Maybe ICliqzModules -> Html Msg
modulesInfo modules =
    let
        renderModule : String -> Html Msg
        renderModule name =
            li []
                [ text <| "[ " ++ name ++ " ]"
                ]

        renderModules : Maybe ICliqzModules -> List (Html Msg)
        renderModules modules =
            case modules of
                Nothing ->
                    [ text "No modules started" ]

                Just { modules } ->
                    toList <| Array.map renderModule modules
    in
        div []
            [ Html.hr [] []
            , text "modules:"
            , ul [] <| renderModules modules
            ]


view : Model -> Html Msg
view { proxy, error, modules } =
    div []
        [ proxyInfo { proxy = proxy, error = error }
        , modulesInfo modules
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        TsElmInterface tsMsg ->
            case tsMsg of
                SubISocksProxy socks ->
                    ( { model | proxy = Just socks }, Cmd.none )

                SubICliqzModules modules ->
                    ( { model | modules = Just modules }, Cmd.none )

                MessagingError err ->
                    ( { model | error = Just err }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Sub.map TsElmInterface tsSubscriptions
        ]
