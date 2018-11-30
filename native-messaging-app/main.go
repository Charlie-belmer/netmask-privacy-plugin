package main

import (
	"fmt"
	"bufio"
	"os"
	"encoding/json"
	"encoding/binary"
)

type message struct {
	length uint32
	data []byte
}

func main() {
	c := make(chan string)
	go readInput(c)
	//go handleInput(c)
	for {
        var input string 
        input = <-c
        //fmt.Println("Received ", input)
        msg := "Received " + input
        m := encodeMessage(msg)
        sendMessage(m)
    }
}

func readInput(channel chan<- string) {
    for {
        var input string
        scanner := bufio.NewScanner(os.Stdin)
        scanner.Scan()
        input = scanner.Text()
        channel <- input
    }
}

func handleInput(channel <- chan string) {
    for {
        var input string 
        input = <-channel
        fmt.Println("Received ", input)
    }
}

func encodeMessage(s string) (message){
	json_string, _ := json.Marshal(s)
	var m message
	m.length = uint32(len(json_string))
	m.data = json_string
	return m
}

func sendMessage(m message) {
	f := bufio.NewWriter(os.Stdout)
	bs := make([]byte, 4)
    binary.LittleEndian.PutUint32(bs, m.length)
	f.Write(bs)
	f.Write(m.data)
	f.Flush()
}