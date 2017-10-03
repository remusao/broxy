port module Broxy exposing (main)

import Html exposing (program, Html, div, text)
import Json.Encode exposing (Value)
import Json.Decode exposing (decodeValue, succeed, string, field, int)
import Json.Decode.Extra exposing ((|:))


port receiveSocksProxyInfo : (Value -> msg) -> Sub msg


port requestSocksProxyInfo : () -> Cmd msg


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias SocksProxy =
    { proxyPort : Int
    , proxyHost : String
    }


type alias Model =
    { proxy : Maybe SocksProxy }


type Msg
    = NoOp
    | SocksProxyRunning (Maybe SocksProxy)


init : ( Model, Cmd Msg )
init =
    ( { proxy = Nothing }, requestSocksProxyInfo () )


view : Model -> Html Msg
view { proxy } =
    case proxy of
        Nothing ->
            text "No proxy information available yet"

        Just { proxyPort, proxyHost } ->
            div []
                [ text "You can now connect to the socks proxy using:"
                , text
                    (proxyHost ++ ":" ++ toString proxyPort)
                ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        SocksProxyRunning socks ->
            ( { model | proxy = socks }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receiveSocksProxyInfo decodeSocksProxy
        ]


decodeSocksProxy : Value -> Msg
decodeSocksProxy x =
    let
        decoder =
            succeed SocksProxy
                |: field "proxyPort" int
                |: field "proxyHost" string
    in
        case decodeValue decoder x of
            Ok proxy ->
                SocksProxyRunning (Just proxy)

            Err _ ->
                NoOp
