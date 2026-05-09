import protobuf from 'protobufjs';
import path from 'path';
import { aesCbcEncrypt, aesCbcDecrypt } from './crypto';

const PROTO_DIR = path.join(process.cwd(), 'proto');

export async function loadProto(protoFile: string) {
    const root = await protobuf.load(path.join(PROTO_DIR, protoFile));
    return root;
}

export async function encodeProtobuf(data: any, messageName: string, protoFile: string): Promise<Buffer> {
    const root = await loadProto(protoFile);
    const Message = root.lookupType(messageName);
    const errMsg = Message.verify(data);
    if (errMsg) throw new Error(`Protobuf validation failed: ${errMsg}`);
    const message = Message.create(data);
    const buffer = Message.encode(message).finish();
    return aesCbcEncrypt(Buffer.from(buffer));
}

export async function decodeProtobuf(encodedData: Buffer, messageName: string, protoFile: string, encrypted: boolean = false): Promise<any> {
    const root = await loadProto(protoFile);
    const Message = root.lookupType(messageName);
    
    const dataToDecode = encrypted ? aesCbcDecrypt(encodedData) : encodedData;
    
    let message;
    try {
        // Try decoding directly
        message = Message.decode(dataToDecode);
    } catch (e) {
        // If it fails, try skipping the first 4 bytes (header)
        try {
            message = Message.decode(dataToDecode.subarray(4));
        } catch (innerError) {
            throw e; // Rethrow original error if both fail
        }
    }

    return Message.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
        oneofs: true
    });
}
