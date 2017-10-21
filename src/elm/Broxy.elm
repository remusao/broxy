port module Broxy exposing (main)

-- WARNING: the TsElmInterfaces file is automatically generated at build-time
-- from declarations found in the file `src/ts-elm-interfaces.ts`. Each
-- `interface` declared in this file will generate an Elm type, a subscription,
-- a port and a decoder.

import TsElmInterfaces exposing (..)


-- Normal Elm imports

import Html exposing (program, Html, div, text)


port requestISocksProxy : () -> Cmd msg


port requestICliqzModules : () -> Cmd msg


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
    ( { proxy = Nothing, error = Nothing, modules = Nothing }, requestISocksProxy () )


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


modulesInfo : List String -> Html Msg
modulesInfo modules =
    div [] [ text "modules:" ]


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

                MessagingError err ->
                    ( { model | error = Just err }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Sub.map TsElmInterface tsSubscriptions
        ]
