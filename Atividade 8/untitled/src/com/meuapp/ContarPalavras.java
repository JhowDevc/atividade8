package com.meuapp;

import java.util.Scanner;

public class ContarPalavras {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite uma frase: ");
        String frase = scanner.nextLine();

        String[] palavras = frase.split("\\s+");
        System.out.println("Número de palavras na frase: " + palavras.length);
    }
}
