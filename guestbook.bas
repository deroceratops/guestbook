Function Initialize() Uint64
10 IF EXISTS("owner") THEN GOTO 100
20 STORE("owner", SIGNER())
30 STORE("messageCount", 0)
40 STORE("mascotImageLink", "https://ipfs.io/ipfs/QmVU8epsp6tZuC82L1ifcGSgXRJY9jKdwEhXp5KetiT84B?filename=DSC_3869-2.jpg")
99 RETURN 0
100 RETURN 1
End Function

Function AddMessage(message String) Uint64
20 DIM messageCount as Uint64
30 LET messageCount = LOAD("messageCount")
40 STORE("message_" + messageCount, message)
50 STORE("messageCount", messageCount + 1)
60 RETURN 0
End Function

