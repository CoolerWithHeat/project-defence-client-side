function getHost(withProtocol = true) {

    if (withProtocol) {
        return 'http://16.171.15.58';
    } 
    else {
        return 'ws://16.171.15.58';
    }
}

export default getHost;