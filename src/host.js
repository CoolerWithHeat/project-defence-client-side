function getHost(withProtocol = true) {

    if (withProtocol) {
        return 'https://54.145.45.116';
    } 
    else {
        return 'wss://54.145.45.116';
    }
}

export default getHost;