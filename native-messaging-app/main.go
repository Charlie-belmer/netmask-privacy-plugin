package main

import (
	"bufio"
	"os"
	"encoding/json"
	"encoding/binary"
	"log"
)

type message struct {
	length uint32
	data []byte
}

func main() {
	c := make(chan string)

	logFile, err := os.OpenFile("netmask.log", os.O_RDWR | os.O_CREATE | os.O_APPEND, 0666)
	if err != nil {
        log.Fatal(err)
    }
	defer logFile.Close()
	log.SetOutput(logFile)
	log.Println("Starting up")
	
	go readInput(c)
	handleInput(c)
}

func readInput(channel chan<- string) {
	reader := bufio.NewReader(os.Stdin)
	lnBytes := make([]byte, 4) //length of string to read

    for {
    	_, err := reader.Read(lnBytes)
		if err != nil {
	        log.Fatal(err)
	    }
    	msgLen := binary.LittleEndian.Uint32(lnBytes)
    	log.Printf("Length: %d", msgLen)

    	data := make([]byte, msgLen)
    	_, err = reader.Read(data)
    	if err != nil {
	        log.Fatal(err)
	    }

    	channel <- string(data)
    }
}

func handleInput(channel <- chan string) {
    var input string
    for {
        input = <-channel
        msg := "Received " + input
        log.Print(msg)
        sendMessage(msg)
    }
}

func encodeMessage(s string) (message){
	json_string, _ := json.Marshal(s)
	var m message
	m.length = uint32(len(json_string))
	m.data = json_string
	return m
}

func sendMessage(s string) {
	m := encodeMessage(s)
	f := bufio.NewWriter(os.Stdout)
	bs := make([]byte, 4)
    binary.LittleEndian.PutUint32(bs, m.length)
	f.Write(bs)
	f.Write(m.data)
	f.Flush()
}